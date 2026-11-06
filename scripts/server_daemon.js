/**
 * server_daemon.js — SportAnaliz Pro 7/24 Otonom Sunucu Servisi
 * 
 * KULLANICI TALEBİ:
 * "her gece arka planda saat 00:15de kuponları otomatik eklesin 
 *  bana sormana gerek yok hergün eklesin bu makina server olsun"
 * 
 * Bu sunucu servisi:
 * 1. 7/24 kesintisiz arka planda çalışır.
 * 2. Her gece saat tam 00:15'te otomatik olarak:
 *    - Günün canlı bültenini ve reytingli seans kuponlarını hazırlar.
 *    - Nesine hesabına (14410079556) arka planda otonom giriş yapar.
 *    - Çıkan her modal/uyarıya ("Tamam", "Kabul Et") otomatik onay verir.
 *    - Kuponları "GG.AA.YYYY - 1", "GG.AA.YYYY - 2" şeklinde hesaba kaydeder.
 * 3. HTTP Kontrol Paneli (http://localhost:3333) üzerinden durum raporlar:
 *    - Canlı server durumu, bir sonraki çalışma saati, son kuponlar ve tek tıkla manuel tetikleme.
 * 4. Hata durumunda çökmeyi önleyen tam korumalı try/catch döngüsüne sahiptir.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const PORT = process.env.PORT || 3333;
const ROOT_DIR = path.join(__dirname, '..');
const DATA_CACHE_DIR = path.join(ROOT_DIR, 'data_cache');
const STATE_FILE = path.join(DATA_CACHE_DIR, 'server_daemon_state.json');
const LOG_FILE = path.join(DATA_CACHE_DIR, 'server_daemon.log');

const TARGET_HOUR = 0;
const TARGET_MINUTE = 15;

if (!fs.existsSync(DATA_CACHE_DIR)) {
    fs.mkdirSync(DATA_CACHE_DIR, { recursive: true });
}

function log(msg) {
    const ts = new Date().toLocaleString('tr-TR');
    const line = `[${ts}] ${msg}`;
    console.log(line);
    try {
        fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
    } catch (e) {}
}

function getState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
        }
    } catch (e) {}
    return {
        serverStartedAt: new Date().toISOString(),
        lastRunDate: null,
        lastRunTime: null,
        lastRunStatus: 'Henüz çalışmadı',
        nextScheduledRun: 'Her Gece 00:15',
        history: []
    };
}

function saveState(state) {
    try {
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
        console.error('State kaydetme hatası:', e.message);
    }
}

let isRunningTask = false;

async function executeDailyPipeline(reason = 'Her Gece 00:15 Otonom Zamanlayıcı') {
    if (isRunningTask) {
        log('⚠️ Görev zaten şu anda çalışıyor, mükerrer çağrı engellendi.');
        return { success: false, message: 'Görev zaten yürütülüyor.' };
    }

    isRunningTask = true;
    const startTime = Date.now();
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const today = `${yStr}-${mStr}-${dStr}`;

    log(`===================================================================`);
    log(`🚀 OTONOM KUPON EKLEME BORU HATTI BAŞLATILDI`);
    log(`📋 Sebep: ${reason}`);
    log(`📅 Hedef Gün: ${dStr}.${mStr}.${yStr}`);
    log(`===================================================================`);

    let syncSuccess = false;
    let addSuccess = false;

    try {
        // 1. Güncel verileri ve reytingli seans kuponlarını hazırla
        log('[1/2] Canlı bülten, SofaScore/WhoScored maç reytingleri ve uzman site yorumları işleniyor...');
        const syncScript = path.join(__dirname, 'build_and_sync_all_data.js');
        await new Promise((resolve) => {
            const p = spawn('node', [syncScript], { cwd: ROOT_DIR, stdio: 'inherit' });
            p.on('close', (code) => {
                syncSuccess = (code === 0);
                resolve();
            });
            p.on('error', (err) => {
                log(`Sync hatası: ${err.message}`);
                resolve();
            });
        });

        // 2. Nesine hesabına kuponları otonom kaydet
        log('[2/2] Nesine.com hesabına kuponlar arka planda otonom kaydediliyor...');
        const nesineScript = path.join(__dirname, 'nesine_login_and_add_coupons.js');
        const electronExe = path.join(ROOT_DIR, 'node_modules', 'electron', 'dist', 'electron.exe');

        const env = { ...process.env, NESINE_BACKGROUND: '1' };
        delete env.ELECTRON_RUN_AS_NODE;

        await new Promise((resolve) => {
            let proc = null;
            if (fs.existsSync(electronExe)) {
                proc = spawn(electronExe, [nesineScript, '--background'], { cwd: ROOT_DIR, env, stdio: 'inherit' });
            } else {
                proc = spawn('npx', ['electron', nesineScript, '--background'], { cwd: ROOT_DIR, env, stdio: 'inherit', shell: true });
            }

            proc.on('close', (code) => {
                addSuccess = (code === 0);
                resolve();
            });
            proc.on('error', (err) => {
                log(`Electron başlatma hatası: ${err.message}`);
                resolve();
            });
        });

        const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(1);
        const state = getState();
        state.lastRunDate = today;
        state.lastRunTime = new Date().toLocaleTimeString('tr-TR');
        state.lastRunStatus = addSuccess ? 'BAŞARILI' : 'TAMAMLANDI (Kısmi)';
        state.history = state.history || [];
        state.history.unshift({
            date: today,
            time: state.lastRunTime,
            reason,
            duration: `${elapsedSec}s`,
            success: addSuccess
        });
        if (state.history.length > 30) state.history.pop();
        saveState(state);

        log(`🎉 [BORU HATTI TAMAMLANDI] Süre: ${elapsedSec}s | Durum: ${state.lastRunStatus}`);
        return { success: true, elapsed: elapsedSec };

    } catch (err) {
        log(`❌ [HATA]: ${err.message}`);
        return { success: false, error: err.message };
    } finally {
        isRunningTask = false;
    }
}

// Saat kontrolü (Her 30 saniyede bir)
function checkScheduleTick() {
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const today = `${yStr}-${mStr}-${dStr}`;

    const hour = now.getHours();
    const minute = now.getMinutes();

    const state = getState();

    // Günün 00:15 vakti geldiyse ve bugün henüz çalıştırılmadıysa:
    if (state.lastRunDate !== today) {
        const isTargetWindow = (hour === TARGET_HOUR && minute >= TARGET_MINUTE) || (hour > TARGET_HOUR);
        if (isTargetWindow) {
            log(`⏰ [ZAMANLAYICI TETİKLENDİ] Saat ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}. Nesine kuponları kaydediliyor...`);
            executeDailyPipeline(`Her Gece Saat 00:15 Zamanlanmış Görev (${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')})`);
        }
    }
}

// Windows Task Scheduler kaydı
function ensureWindowsTask() {
    try {
        const batPath = path.join(ROOT_DIR, 'NESINE_KUPON_OTOMATIK_EKLE.bat');
        const taskName = 'SportAnaliz_Nesine_0015';
        const cmd = `schtasks /Create /SC DAILY /TN "${taskName}" /TR "\\"${batPath}\\"" /ST 00:15 /F`;
        execSync(cmd, { stdio: 'ignore' });
        log(`🛡️ Windows Görev Zamanlayıcısı doğrulandı: ${taskName} (00:15)`);
    } catch (e) {
        log(`Windows Görev Zamanlayıcı bildirimi: ${e.message}`);
    }
}

// HTTP Kontrol Paneli Sunucusu
const server = http.createServer((req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    
    // API: Anında Çalıştır
    if (url.pathname === '/api/run-now') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        if (isRunningTask) {
            return res.end(JSON.stringify({ status: 'already_running', message: 'İşlem zaten arka planda yürütülüyor.' }));
        }
        executeDailyPipeline('Web Kontrol Panelinden Manuel Tetikleme');
        return res.end(JSON.stringify({ status: 'started', message: 'Nesine kupon ekleme işlemi arka planda başlatıldı.' }));
    }

    // API: Durum Bilgisi
    if (url.pathname === '/api/status') {
        const state = getState();
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({
            serverActive: true,
            isRunningTask,
            state,
            currentTime: new Date().toLocaleTimeString('tr-TR')
        }));
    }

    // Ana Sayfa Dashboard UI
    const state = getState();
    let couponData = null;
    try {
        const cPath = path.join(DATA_CACHE_DIR, 'nesine_coupons_today.json');
        if (fs.existsSync(cPath)) {
            couponData = JSON.parse(fs.readFileSync(cPath, 'utf8'));
        }
    } catch (e) {}

    const coupons = couponData?.coupons || [];
    let couponCardsHtml = '';
    coupons.forEach(c => {
        let picksHtml = '';
        (c.picks || []).forEach(p => {
            picksHtml += `
                <div style="background:#1E293B;padding:8px 12px;border-radius:6px;margin-bottom:6px;font-size:13px;display:flex;justify-content:space-between;align-items:center;">
                    <div>
                        <b>${p.timeStr || ''}</b> ${p.homeTeam} - ${p.awayTeam} 
                        <span style="color:#10B981;font-weight:bold;margin-left:8px;">${p.pickTitle}</span>
                        ${p.siteReview ? `<div style="color:#94A3B8;font-size:11px;margin-top:2px;">✍️ ${p.siteReview}</div>` : ''}
                    </div>
                    <div style="background:#334155;color:#F59E0B;padding:3px 8px;border-radius:4px;font-weight:bold;">${p.odd}</div>
                </div>
            `;
        });

        couponCardsHtml += `
            <div style="background:#0F172A;border:1px solid #334155;border-radius:10px;padding:16px;margin-bottom:14px;box-shadow:0 4px 12px rgba(0,0,0,0.3);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #1E293B;padding-bottom:8px;">
                    <div>
                        <span style="background:#3B82F6;color:#fff;font-size:11px;font-weight:bold;padding:3px 8px;border-radius:4px;margin-right:8px;">${c.sessionName || 'Seans'}</span>
                        <b style="font-size:15px;color:#F8FAFC;">${c.title}</b>
                    </div>
                    <div style="font-size:15px;color:#10B981;font-weight:bold;">Toplam Oran: ${c.totalOdd}</div>
                </div>
                ${picksHtml}
            </div>
        `;
    });

    const html = `
    <!DOCTYPE html>
    <html lang="tr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>SportAnaliz Pro — 7/24 Otonom Nesine Sunucusu</title>
        <style>
            body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #090D16; color: #F1F5F9; margin: 0; padding: 24px; }
            .container { max-width: 1000px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; align-items: center; background: #0F172A; padding: 20px 24px; border-radius: 12px; border: 1px solid #1E293B; margin-bottom: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.4); }
            .status-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(16, 185, 129, 0.15); color: #10B981; border: 1px solid #10B981; padding: 6px 14px; border-radius: 20px; font-weight: bold; font-size: 13px; }
            .dot { width: 8px; height: 8px; background: #10B981; border-radius: 50%; box-shadow: 0 0 10px #10B981; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
            .btn { background: linear-gradient(135deg, #10B981, #059669); color: #fff; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 14px; transition: transform 0.1s, opacity 0.2s; }
            .btn:hover { opacity: 0.9; transform: translateY(-1px); }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 24px; }
            .card { background: #0F172A; border: 1px solid #1E293B; border-radius: 10px; padding: 16px; }
            .card-title { color: #94A3B8; font-size: 12px; text-transform: uppercase; font-weight: bold; margin-bottom: 6px; }
            .card-value { font-size: 20px; font-weight: bold; color: #F8FAFC; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div>
                    <h2 style="margin: 0 0 6px 0; color: #F8FAFC;">⚡ SportAnaliz Pro Server</h2>
                    <div style="color: #94A3B8; font-size: 13px;">Nesine.com 7/24 Arka Plan Otonom Kupon Kaydedici</div>
                </div>
                <div style="display: flex; gap: 12px; align-items: center;">
                    <a href="https://www.nesine.com/kuponlarim/iddaa-kayitli" target="_blank" style="text-decoration:none;" class="btn" style="background:#2563EB;">🔗 NESİNE'DE GÖR (KAYITLI KUPONLAR)</a>
                    <button class="btn" onclick="triggerRunNow()">⚡ ŞİMDİ YENİDEN EKLE</button>
                </div>
            </div>

            <div class="grid">
                <div class="card">
                    <div class="card-title">⏰ Zamanlanmış Saat</div>
                    <div class="card-value" style="color: #38BDF8;">Her Gece 00:15</div>
                </div>
                <div class="card">
                    <div class="card-title">👤 Nesine Hesabı</div>
                    <div class="card-value">14410079556</div>
                </div>
                <div class="card">
                    <div class="card-title">📅 Son Çalışma</div>
                    <div class="card-value" style="font-size: 16px;">${state.lastRunDate || 'Henüz Yok'} (${state.lastRunTime || '--:--'})</div>
                </div>
                <div class="card">
                    <div class="card-title">📊 Son İşlem Durumu</div>
                    <div class="card-value" style="color: #10B981; font-size: 16px;">${state.lastRunStatus}</div>
                </div>
            </div>

            <h3 style="color: #F8FAFC; margin-bottom: 14px;">📋 Günün Hazır Kuponları (${coupons.length} Adet)</h3>
            ${couponCardsHtml || '<div style="color:#94A3B8;">Henüz kupon verisi yüklenmedi.</div>'}
        </div>

        <script>
            function triggerRunNow() {
                if (confirm('Nesine kupon ekleme işlemi arka planda hemen başlatılsın mı?')) {
                    fetch('/api/run-now')
                        .then(r => r.json())
                        .then(data => {
                            alert(data.message);
                            setTimeout(() => location.reload(), 2000);
                        })
                        .catch(e => alert('Hata: ' + e.message));
                }
            }
            setInterval(() => {
                fetch('/api/status').then(r => r.json()).then(data => {
                    if (data.isRunningTask) {
                        console.log('Sunucu kuponları ekliyor...');
                    }
                }).catch(()=>{});
            }, 5000);
        </script>
    </body>
    </html>
    `;

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
});

// Sunucuyu başlat
server.listen(PORT, '0.0.0.0', () => {
    log(`===================================================================`);
    log(`🟢 SPORTANALIZ PRO SERVER BAŞLATILDI`);
    log(`📡 Web Dashboard: http://localhost:${PORT}`);
    log(`⏰ Otomatik Kupon Zamanı: Her Gece 00:15`);
    log(`👤 Nesine Üye: 14410079556`);
    log(`===================================================================`);

    ensureWindowsTask();

    // Zamanlayıcıyı periyodik kontrol et
    setTimeout(checkScheduleTick, 3000);
    setInterval(checkScheduleTick, 30 * 1000);
});

// Beklenmeyen çökmeleri engelle
process.on('uncaughtException', (err) => {
    log(`⚠️ [uncaughtException]: ${err.message}`);
});
process.on('unhandledRejection', (reason) => {
    log(`⚠️ [unhandledRejection]: ${reason}`);
});

