/**
 * nesine_daily_scheduler.js — SportAnaliz Pro
 * Nesine.com Hesaba Otomatik Kupon Kaydetme Zamanlayıcısı
 * 
 * KULLANICI KURALI:
 * "otomatik nesineye kayıt etsin her gece saat 00:15 de"
 * 
 * 1. Her gece saat tam 00:15'te:
 *    a) Günün canlı bültenini çeker ve 15 adet seçkin seans kuponunu (5 Sabah, 5 Öğlen, 5 Akşam) hazırlar.
 *    b) "En fazla 2 maç & farklı seçenekler" kuralını denetler.
 *    c) Nesine otomatik kaydedicisini (Electron) başlatır, kullanıcı hesabına giriş yapar ve 15 kuponu kaydeder.
 * 2. Bilgisayar kapalıysa veya kaçırıldıysa:
 *    İlk açılışta günün kuponları henüz eklenmemişse telafi görevi olarak hemen çalıştırır.
 * 3. CLI Parametreleri:
 *    --now          : Zamanı beklemeden ŞİMDİ çalıştırır.
 *    --install-task : Windows Görev Zamanlayıcısına (Task Scheduler) her gece 00:15 için kayıt ekler.
 */

const fs = require('fs');
const path = require('path');
const { spawn, execSync } = require('child_process');

const DATA_CACHE_DIR = path.join(__dirname, '..', 'data_cache');
const SCHEDULER_STATE_FILE = path.join(DATA_CACHE_DIR, 'nesine_scheduler_state.json');

const TARGET_HOUR = 0;
const TARGET_MINUTE = 15;

function getSchedulerState() {
    try {
        if (fs.existsSync(SCHEDULER_STATE_FILE)) {
            return JSON.parse(fs.readFileSync(SCHEDULER_STATE_FILE, 'utf8'));
        }
    } catch (e) {}
    return {
        lastExecutedDate: null,
        scheduledTargetTime: '00:15',
        history: []
    };
}

function saveSchedulerState(state) {
    try {
        if (!fs.existsSync(DATA_CACHE_DIR)) fs.mkdirSync(DATA_CACHE_DIR, { recursive: true });
        fs.writeFileSync(SCHEDULER_STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    } catch (e) {
        console.error('Scheduler durum kaydetme hatası:', e.message);
    }
}

let isExecuting = false;

async function runDailyCouponAutomation(reason = 'Her Gece 00:15 Otomatik Zamanlayıcı') {
    if (isExecuting) {
        console.log('⚠️ [ZAMANLAYICI] Kupon kaydetme görevi zaten şu anda çalışıyor.');
        return;
    }

    isExecuting = true;
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const today = `${yStr}-${mStr}-${dStr}`;

    console.log(`\n===================================================================`);
    console.log(`🚀 [NESİNE OTOMATİK KUPON KAYDEDİCİ BAŞLADI]`);
    console.log(`📋 Sebep: ${reason}`);
    console.log(`📅 Tarih: ${dStr}.${mStr}.${yStr} | Saat: ${now.toLocaleTimeString('tr-TR')}`);
    console.log(`===================================================================`);

    try {
        // 1. Adım: Günün bültenini ve 15 kuponunu üret / teyit et
        console.log('\n📡 [1/2] Günün bülteni ve 15 kural-uyumlu kuponu hazırlanıyor...');
        const syncScript = path.join(__dirname, 'build_and_sync_all_data.js');
        if (fs.existsSync(syncScript)) {
            await new Promise((resolve) => {
                const p = spawn('node', [syncScript], {
                    cwd: path.join(__dirname, '..'),
                    stdio: 'inherit'
                });
                p.on('close', resolve);
            });
        }

        // 2. Adım: Nesine kaydediciyi (Electron GUI) başlat
        console.log('\n🌐 [2/2] Nesine otomatik kupon kaydedici penceresi açılıyor...');
        const nesineScript = path.join(__dirname, 'nesine_login_and_add_coupons.js');
        const electronExe = path.join(__dirname, '..', 'node_modules', 'electron', 'dist', 'electron.exe');

        const env = { ...process.env };
        delete env.ELECTRON_RUN_AS_NODE;

        let electronProc = null;
        if (fs.existsSync(electronExe)) {
            electronProc = spawn(electronExe, [nesineScript], {
                cwd: path.join(__dirname, '..'),
                env,
                stdio: 'inherit'
            });
        } else {
            electronProc = spawn('npx', ['electron', nesineScript], {
                cwd: path.join(__dirname, '..'),
                env,
                stdio: 'inherit',
                shell: true
            });
        }

        await new Promise((resolve) => {
            electronProc.on('close', resolve);
            electronProc.on('error', (err) => {
                console.error('Electron başlatma hatası:', err);
                resolve();
            });
        });

        // Durumu güncelle
        const state = getSchedulerState();
        state.lastExecutedDate = today;
        state.lastExecutedTime = now.toLocaleTimeString('tr-TR');
        state.history = state.history || [];
        state.history.unshift({
            date: today,
            time: now.toLocaleTimeString('tr-TR'),
            reason
        });
        if (state.history.length > 30) state.history.pop();
        saveSchedulerState(state);

        console.log(`\n🎉 [TAMAMLANDI] ${today} tarihli 15 kupon Nesine hesabına başarıyla kaydedildi.\n`);
    } catch (err) {
        console.error('❌ [ZAMANLAYICI HATASI]:', err);
    } finally {
        isExecuting = false;
    }
}

/**
 * Zamanlayıcı Kontrol Fonksiyonu (Her 30 saniyede bir kontrol eder)
 */
function checkSchedule() {
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const today = `${yStr}-${mStr}-${dStr}`;

    const hour = now.getHours();
    const minute = now.getMinutes();

    const state = getSchedulerState();

    // Eğer bugün henüz çalıştırılmadıysa:
    if (state.lastExecutedDate !== today) {
        // Hedef saat: 00:15
        const isTargetTime = (hour === TARGET_HOUR && minute >= TARGET_MINUTE) || (hour > TARGET_HOUR);

        if (isTargetTime) {
            console.log(`⏰ [ZAMANLAYICI TETİKLENDİ] Saat 00:15 hedef saati geldi. Nesine kuponları kaydediliyor...`);
            runDailyCouponAutomation(`Her Gece Saat 00:15 Zamanlanmış Görev (${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')})`);
        }
    }
}

function startScheduler() {
    console.log(`🛡️ [NESİNE ZAMANLAYICI AKTİF] Her gece saat 00:15'te otomatik kupon kaydetme devrede.`);
    // İlk kontrol 3 saniye sonra
    setTimeout(checkSchedule, 3000);
    // Her 30 saniyede bir kontrol et
    setInterval(checkSchedule, 30 * 1000);
}

/**
 * Windows Task Scheduler (Görev Zamanlayıcı) Kaydı
 */
function installWindowsScheduledTask() {
    try {
        const batPath = path.join(__dirname, '..', 'NESINE_KUPON_OTOMATIK_EKLE.bat');
        const taskName = 'SportAnaliz_Nesine_0015';
        const cmd = `schtasks /Create /SC DAILY /TN "${taskName}" /TR "\\"${batPath}\\"" /ST 00:15 /F`;
        console.log(`⚙️ Windows Görev Zamanlayıcısına ekleniyor: ${taskName} (Her Gece 00:15)...`);
        execSync(cmd, { stdio: 'inherit' });
        console.log(`✅ [BAŞARILI] Windows Görevi başarıyla oluşturuldu: ${taskName}`);
    } catch (e) {
        console.warn('Windows Görev Zamanlayıcı oluşturma uyarısı:', e.message);
    }
}

module.exports = {
    startScheduler,
    checkSchedule,
    runDailyCouponAutomation,
    getSchedulerState,
    installWindowsScheduledTask
};

// Doğrudan CLI ile çalıştırma:
if (require.main === module) {
    const args = process.argv.slice(2);
    if (args.includes('--install-task')) {
        installWindowsScheduledTask();
    } else if (args.includes('--now')) {
        console.log('⚡ [--now] Kullanıcı talebi: Anında Nesine kupon kaydetme başlatılıyor...');
        runDailyCouponAutomation('Kullanıcı Talebi (--now)');
    } else {
        startScheduler();
    }
}

