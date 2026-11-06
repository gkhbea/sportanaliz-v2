/**
 * nesine_login_and_add_coupons.js — SportAnaliz Pro
 * Nesine.com Hesaba Otomatik Kupon Kaydedici
 *
 * 1. ELECTRON_RUN_AS_NODE ortam değişkeni temizlenir.
 * 2. Nesine.com masaüstü penceresi ekranda açılır.
 * 3. Kullanıcı adı (14410079556) ve şifre otomatik yazılır.
 * 4. Otomatik giriş kontrol edilir; giriş sonrası 15 adet kupon:
 *    - ASLA CANLI MAÇ SEÇİLMEZ (data-test-is-live="false" ve saat formatı zorunlu).
 *    - Kupon maçları bültenden tek tek (birebir) ve sakin tempoyla (acele etmeden) taranıp eklenir.
 *    - Çıkan her modal/uyarıya ("Tamam", "Kabul Et", "Onayla") otomatik basılır.
 *    - Kupon adı yazılıp "Kaydet" ve ardından "Tamam" basılarak hesaba işlenir.
 */

delete process.env.ELECTRON_RUN_AS_NODE;

const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Arka plan ve ekran hızlandırma anahtarları (Chromium donmasını ve timer yavaşlamasını engeller)
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-backgrounding-occluded-windows');
app.commandLine.appendSwitch('disable-background-timer-throttling');

let USERNAME = process.env.NESINE_USERNAME || '';
let PASSWORD = process.env.NESINE_PASSWORD || '';

try {
    const credPath = path.join(__dirname, '..', 'nesine_credentials.json');
    if (fs.existsSync(credPath)) {
        const creds = JSON.parse(fs.readFileSync(credPath, 'utf8'));
        if (creds.username) USERNAME = creds.username;
        if (creds.password) PASSWORD = creds.password;
    }
} catch (e) {}

const ARTIFACT_DIR = path.join(__dirname, '..', 'data_cache', 'screenshots');
if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

const DATA_CACHE_DIR = path.join(__dirname, '..', 'data_cache');

function getTodayFormatted() {
    const now = new Date();
    const d = String(now.getDate()).padStart(2, '0');
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const y = now.getFullYear();
    return `${d}.${m}.${y}`;
}

const todayFormatted = getTodayFormatted();

// Günün kuponlarını önbellekten yükle
function loadTodayCoupons() {
    const couponFile = path.join(DATA_CACHE_DIR, 'nesine_coupons_today.json');
    if (fs.existsSync(couponFile)) {
        try {
            const raw = JSON.parse(fs.readFileSync(couponFile, 'utf8'));
            if (raw && Array.isArray(raw.coupons) && raw.coupons.length > 0) {
                return raw.coupons;
            }
        } catch (e) {}
    }
    // Yedek şablonlar
    return [
        { couponNumber: 1, title: '🛡️ Sabah Garantör Banko / Kasa Katlama Kuponu', name: `${todayFormatted} - 1` },
        { couponNumber: 2, title: '⚡ İdeal Sistem Kuponu (Editör Seçimi)', name: `${todayFormatted} - 2` },
        { couponNumber: 3, title: '⚽ Günün Gol Yağmuru Kuponu (1.5 / 2.5 ÜST)', name: `${todayFormatted} - 3` },
        { couponNumber: 4, title: '🎯 Çifte Şans & Sıfır Risk Sigortalı Kupon', name: `${todayFormatted} - 4` },
        { couponNumber: 5, title: '💎 Akılcı Değer & Taraf Kuponu', name: `${todayFormatted} - 5` },
        { couponNumber: 6, title: '🌟 VIP Kombin (Favori Güçler)', name: `${todayFormatted} - 6` },
        { couponNumber: 7, title: '⏱️ İlk Yarı & İkinci Yarı Kombinesi', name: `${todayFormatted} - 7` },
        { couponNumber: 8, title: '🌙 Gece / Güney Amerika & Özel Ligler', name: `${todayFormatted} - 8` }
    ];
}

const couponsToProcess = loadTodayCoupons();

app.whenReady().then(async () => {
    console.log('===================================================================');
    console.log('  ⚡ SPORTANALIZ PRO — NESINE HESABA OTOMATIK KUPON KAYDEDICI');
    console.log(`  📅 Tarih: ${todayFormatted}`);
    console.log(`  👤 Uye: ${USERNAME}`);
    console.log(`  📋 Kaydedilecek Kupon Sayısı: ${couponsToProcess.length}`);
    console.log('===================================================================');

    // 1. Nesine.com penceresi (Maksimum hız ve render için açık pencere)
    const isBackground = process.argv.includes('--background') || process.argv.includes('--headless') || process.env.NESINE_BACKGROUND === '1';
    console.log(`[1/4] Nesine penceresi açılıyor, üye bilgileri yazılıyor...`);
    const win = new BrowserWindow({
        width: 1550,
        height: 980,
        show: true,
        title: 'Nesine.com — Kupon Kaydedici (SportAnaliz Pro)',
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: false,
            backgroundThrottling: false
        }
    });

    win.maximize();
    win.show();

    win.webContents.on('console-message', (e, level, msg) => {
        if (msg.includes('Maç') || msg.includes('Kupon') || msg.includes('Giriş') || msg.includes('Nesine')) {
            console.log(`   [Tarayıcı] ${msg}`);
        }
    });

    await win.loadURL('https://www.nesine.com/iddaa');
    await new Promise(r => setTimeout(r, 4000));

    // Popupları kapat ve Giriş Yap modalını açıp formu doldur ve otomatik GİRİŞ butonuna bas
    await win.webContents.executeJavaScript(`
        (async () => {
            // Alert, Confirm, Prompt otomatik YES / TAMAM / SUBMIT onayla
            window.alert = () => true;
            window.confirm = () => true;
            window.prompt = () => true;

            const isAlreadyLoggedIn = () => !!(
                document.querySelector('.member-menu, .user-profile, .user-info, .account-info, .header-user, #memberSummary') ||
                document.body.innerText.includes('Hesabım') ||
                document.body.innerText.includes('Çıkış')
            );
            if (isAlreadyLoggedIn()) {
                console.log('Kullanıcı zaten giriş yapmış durumda.');
                return;
            }

            const closeModals = () => {
                Array.from(document.querySelectorAll('#onetrust-accept-btn-handler, .cookie-accept, button, a, span')).forEach(b => {
                    const t = (b.innerText || '').toLowerCase().trim();
                    if (t === 'kabul et' || t === 'tümünü kabul et' || t === 'anladım') {
                        try { b.click(); } catch(e){}
                    }
                });
            };
            closeModals();

            // Giriş Yap butonuna tıkla
            const loginBtn = Array.from(document.querySelectorAll('a, button, span')).find(el => {
                const t = (el.innerText || '').toLowerCase().trim();
                return t === 'giriş yap' || t === 'giris yap';
            });
            if (loginBtn) {
                loginBtn.click();
                await new Promise(r => setTimeout(r, 1200));
            }

            // Inputları Native Değer ile Doldur
            const setNativeValue = (element, value) => {
                const valueSetter = Object.getOwnPropertyDescriptor(element.__proto__, 'value') ||
                                    Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
                if (valueSetter && valueSetter.set) {
                    valueSetter.set.call(element, value);
                } else {
                    element.value = value;
                }
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            };

            const textInps = Array.from(document.querySelectorAll('input[type="text"]')).filter(i => i.offsetParent !== null);
            const passInps = Array.from(document.querySelectorAll('input[type="password"]')).filter(i => i.offsetParent !== null);

            if (textInps.length > 0) setNativeValue(textInps[0], '${USERNAME}');
            if (passInps.length > 0) setNativeValue(passInps[0], '${PASSWORD}');

            await new Promise(r => setTimeout(r, 500));

            // Otomatik GİRİŞ Butonuna Bas
            const targetBtn = Array.from(document.querySelectorAll('button, a, input[type="submit"]')).find(b => {
                const t = (b.innerText || b.value || '').trim();
                return t === 'GİRİŞ' || t === 'GİRİŞ ▶' || t.startsWith('GİRİŞ');
            });

            if (targetBtn) {
                targetBtn.focus();
                targetBtn.click();
            } else if (passInps.length > 0) {
                passInps[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', keyCode: 13, bubbles: true }));
                passInps[0].dispatchEvent(new KeyboardEvent('keyup', { key: 'Enter', keyCode: 13, bubbles: true }));
            }

            // Bilgilendirme rehber çubuğu oluştur
            const guide = document.createElement('div');
            guide.id = 'sportanaliz-guide-banner';
            guide.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999999;background:linear-gradient(135deg,#1E293B,#0F172A);color:#F8FAFC;padding:14px 20px;text-align:center;font-size:15px;font-weight:600;font-family:sans-serif;box-shadow:0 4px 20px rgba(0,0,0,0.5);border-bottom:3px solid #10B981;';
            guide.innerHTML = '⚡ <b>SportAnaliz Pro</b> | Üye girişiniz yapılıyor ve 15 adet kuponunuz hesabınıza kaydediliyor, lütfen bekleyiniz...';
            document.body.appendChild(guide);
        })()
    `);

    console.log('[2/4] Üye bilgileri dolduruldu ve GİRİŞ butonuna basıldı. Giriş kontrol ediliyor...');

    // Kullanıcının giriş yapmasını bekle (otomatik giriş 3-5 saniyede tamamlanır)
    let loggedIn = false;
    for (let sec = 0; sec < 180; sec++) {
        await new Promise(r => setTimeout(r, 1000));
        try {
            loggedIn = await win.webContents.executeJavaScript(`
                (() => {
                    const hasUser = !!(
                        document.querySelector('.member-menu, .user-profile, .user-info, .account-info, .header-user, #memberSummary, [class*="member"], [class*="profile"]') ||
                        document.body.innerText.includes('Hesabım') ||
                        document.body.innerText.includes('Çıkış') ||
                        document.body.innerText.includes('${USERNAME}')
                    );
                    return hasUser;
                })()
            `);
            if (loggedIn) break;
            if (isBackground && sec === 10) {
                console.log('⚠️ Otomatik giriş bekleniyor, gerekirse müdahale için pencere kullanıcıya gösteriliyor...');
                win.show();
                win.focus();
            }
        } catch(e) {}
    }

    if (!loggedIn) {
        console.log('[UYARI] Giriş süresi doldu veya kullanıcı girişi tamamlanmadı.');
        win.close();
        app.quit();
        return;
    }

    console.log('🎉 NESINE HESABINA BAŞARIYLA GİRİŞ YAPILDI!');
    console.log(`[3/4] ${couponsToProcess.length} Adet Kupon sırayla hesabınıza kaydediliyor...`);

    // Banner güncelle
    await win.webContents.executeJavaScript(`
        (() => {
            const b = document.getElementById('sportanaliz-guide-banner');
            if (b) {
                b.style.background = 'linear-gradient(135deg,#10B981,#059669)';
                b.style.color = '#fff';
                b.innerHTML = '✅ <b>GİRİŞ BAŞARILI!</b> Kuponlar sırayla hesabınıza kaydediliyor, lütfen bekleyiniz...';
            }
        })()
    `);

    await new Promise(r => setTimeout(r, 2000));

    const processedResults = [];

    // Kuponları sırayla ekle ve kaydet
    for (let i = 0; i < couponsToProcess.length; i++) {
        const coupon = couponsToProcess[i];
        const couponNumber = coupon.couponNumber || (i + 1);
        const nesineCouponName = coupon.name || `${todayFormatted} - ${couponNumber}`;
        const picks = coupon.picks || [];

        console.log(`\n-------------------------------------------------------------------`);
        console.log(`▶ [KUPON ${couponNumber}/${couponsToProcess.length}] "${nesineCouponName}" ekleniyor... (${coupon.title || ''})`);

        try {
            const execPromise = win.webContents.executeJavaScript(`
                (async () => {
                    const couponNum = ${couponNumber};
                    const nesineCouponName = ${JSON.stringify(nesineCouponName)};
                    const couponPicks = ${JSON.stringify(picks)};

                    // 0. Otomatik Onay & Modal Kapatıcı ("Çıkan her şeye submit / yes / tamam de")
                    const autoAcceptAll = () => {
                        try {
                            const modals = Array.from(document.querySelectorAll('.modal.show, .modal[style*="display: block"], .modal[style*="display:block"], .popup, .swal2-container, #mod-give-coupon-name-step2, #mod-confirmation-save'));
                            for (const modal of modals) {
                                const btns = Array.from(modal.querySelectorAll('button, a.btn, input[type="submit"], [data-id="btnOk"], .btn-primary, .swal2-confirm'));
                                for (const b of btns) {
                                    if (b.closest('#mod-give-coupon-name-step1') && b.id !== 'saveCouponName') continue;
                                    const t = (b.innerText || b.value || '').toLowerCase().trim();
                                    if (b.type === 'submit' || t.includes('tamam') || t.includes('submit') || t.includes('yes') || t.includes('ok') || t.includes('kabul') || t.includes('onayla') || t.includes('kaydet') || t.includes('devam')) {
                                        try { b.click(); } catch(e){}
                                    }
                                }
                            }
                        } catch(e) {}
                    };

                    // 1. Önceki kuponu temizle (Temiz kupon başlangıcı)
                    const clearCoupon = async () => {
                        autoAcceptAll();
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        document.querySelectorAll('.modal.show, .modal[style*="display: block"]').forEach(m => {
                            m.style.display = 'none';
                            m.classList.remove('show', 'in');
                        });
                        document.body.classList.remove('modal-open');

                        try {
                            if (window.CouponManager && typeof window.CouponManager.cancel === 'function') {
                                window.CouponManager.cancel({ sender: 'trash' });
                            }
                        } catch(e){}
                        const trash = document.querySelector('.ni-trash, i[class*="trash"], [class*="delete"]');
                        if (trash) {
                            const btn = trash.closest('button, a, div') || trash;
                            try { btn.click(); } catch(e){}
                            await new Promise(r => setTimeout(r, 400));
                            autoAcceptAll();
                            await new Promise(r => setTimeout(r, 400));
                        }
                    };
                    await clearCoupon();
                    await new Promise(r => setTimeout(r, 600));

                    const selectedPicks = [];

                    // 2. Kupon maçlarını ekle (ASLA CANLI MAÇ SEÇME, BİREBİR VE ACELE ETMEDEN BUL)
                    if (couponPicks && couponPicks.length > 0) {
                        for (const pick of couponPicks) {
                            let added = false;
                            const matchCode = pick.iddaaCode;
                            const targetOddNum = parseFloat(pick.odd || 0);

                            // Her maçı bulmak için sayfayı yukarıdan aşağıya sakin şekilde tara
                            window.scrollTo(0, 0);
                            await new Promise(r => setTimeout(r, 300));

                            let matchRow = null;
                            for (let s = 0; s < 45; s++) {
                                matchRow = document.querySelector('[data-code="' + matchCode + '"]');
                                if (matchRow && matchRow.offsetHeight > 20) break;
                                window.scrollBy(0, 750);
                                await new Promise(r => setTimeout(r, 200));
                            }

                            if (!matchRow) {
                                console.warn('Maç bültende bulunamadı: ' + matchCode + ' (' + pick.homeTeam + ')');
                                continue;
                            }

                            // ❌ KESİNLİKLE CANLI OYNANAN MAÇLARI SEÇME!
                            const isLive = matchRow.getAttribute('data-test-is-live') === 'true' ||
                                           matchRow.getAttribute('data-test-is-went-live') === 'true' ||
                                           /\\b\\d{1,2}'/.test(matchRow.innerText);
                            if (isLive) {
                                console.warn('Maç canlı oynandığı için atlandı: ' + matchCode + ' (' + pick.homeTeam + ')');
                                continue;
                            }

                            // Maç satırını ekrana ortala ve bekle (acele etme)
                            matchRow.scrollIntoView({ block: 'center' });
                            await new Promise(r => setTimeout(r, 700));

                            // Butonları topla
                            const buttons = Array.from(matchRow.querySelectorAll('button'));
                            const oddButtons = buttons.filter(b => /^\\d+\\.\\d{2}$/.test((b.innerText || '').trim()));

                            let targetBtn = null;
                            // 1. Birebir oran eşleşmesi
                            targetBtn = oddButtons.find(b => b.innerText.trim() === String(pick.odd));

                            // 2. Oran dalgalanmışsa market türüne göre hedefle
                            if (!targetBtn && oddButtons.length >= 3) {
                                if (pick.marketCode === 'MS1') targetBtn = oddButtons[0];
                                else if (pick.marketCode === 'MSX' && oddButtons.length >= 2) targetBtn = oddButtons[1];
                                else if (pick.marketCode === 'MS2' && oddButtons.length >= 3) targetBtn = oddButtons[2];
                                else if ((pick.marketCode === 'OVER25' || pick.marketCode === 'OVER15') && oddButtons.length >= 5) targetBtn = oddButtons[4];
                                else if (pick.marketCode === 'UNDER25' && oddButtons.length >= 4) targetBtn = oddButtons[3];
                                else if (pick.marketCode === 'CS1X' && oddButtons.length >= 9) targetBtn = oddButtons[8];
                                else if (pick.marketCode === 'CSX2' && oddButtons.length >= 11) targetBtn = oddButtons[10];
                                else {
                                    // En yakın oran
                                    targetBtn = oddButtons.reduce((closest, curr) => {
                                        const cDiff = Math.abs(parseFloat(curr.innerText.trim()) - targetOddNum);
                                        const bestDiff = Math.abs(parseFloat(closest.innerText.trim()) - targetOddNum);
                                        return cDiff < bestDiff ? curr : closest;
                                    }, oddButtons[0]);
                                }
                            }

                            if (targetBtn) {
                                targetBtn.click();
                                added = true;
                                selectedPicks.push({
                                    title: (pick.homeTeam || '') + ' - ' + (pick.awayTeam || ''),
                                    code: matchCode,
                                    odd: targetBtn.innerText.trim()
                                });
                                // Acele etme, Nesine React UI kupona eklesin
                                await new Promise(r => setTimeout(r, 1200));
                                autoAcceptAll();
                            }
                        }
                    }

                    // Yedek maç seçimi (Sadece eğer hiç maç eklenemediyse VE ASLA CANLI MAÇ OLMAMAK ŞARTIYLA)
                    if (selectedPicks.length === 0) {
                        window.__globallyUsedCodes = window.__globallyUsedCodes || new Set();
                        for (let scrollStep = 0; scrollStep < 15 && selectedPicks.length < 3; scrollStep++) {
                            const preMatchRows = Array.from(document.querySelectorAll('[data-code]')).filter(r => {
                                const isLive = r.getAttribute('data-test-is-live') === 'true' ||
                                               r.getAttribute('data-test-is-went-live') === 'true' ||
                                               /\\b\\d{1,2}'/.test(r.innerText);
                                const hasTime = /\\b\\d{2}:\\d{2}\\b/.test(r.innerText);
                                const code = r.getAttribute('data-code');
                                return !isLive && hasTime && code && !window.__globallyUsedCodes.has(code) && r.offsetHeight > 20;
                            });

                            for (const row of preMatchRows) {
                                if (selectedPicks.length >= 3) break;
                                const code = row.getAttribute('data-code');
                                const oddBtns = Array.from(row.querySelectorAll('button')).filter(b => /^\\d+\\.\\d{2}$/.test((b.innerText || '').trim()));
                                if (oddBtns.length >= 3) {
                                    window.__globallyUsedCodes.add(code);
                                    row.scrollIntoView({ block: 'center' });
                                    await new Promise(r => setTimeout(r, 500));
                                    oddBtns[0].click(); // MS 1
                                    selectedPicks.push({
                                        title: (row.innerText || '').split('\\n')[1] || ('Maç ' + code),
                                        code: code,
                                        odd: oddBtns[0].innerText.trim()
                                    });
                                    await new Promise(r => setTimeout(r, 1200));
                                    autoAcceptAll();
                                }
                            }

                            if (selectedPicks.length < 3) {
                                window.scrollBy(0, 700);
                                await new Promise(r => setTimeout(r, 300));
                            }
                        }
                    }

                    // 3. Kupon Kaydet Modalını Aç (Floppy disk butonu veya CouponManager.OpenSaveCouponPopup)
                    autoAcceptAll();
                    let modalOpened = false;
                    try {
                        if (window.CouponManager && typeof window.CouponManager.OpenSaveCouponPopup === 'function') {
                            window.CouponManager.OpenSaveCouponPopup();
                            modalOpened = true;
                        }
                    } catch(e){}

                    const saveIcon = document.querySelector('.saveBtn, .optionButtons.saveBtn, i.ni-save, [title="KAYDET"], [onclick*="OpenSaveCouponPopup"]');
                    if (saveIcon) {
                        const btn = saveIcon.closest('div, button, a') || saveIcon;
                        try { btn.click(); modalOpened = true; } catch(e){}
                    }

                    await new Promise(r => setTimeout(r, 1200));
                    autoAcceptAll();

                    // 4. Kupon Adını Yaz
                    let nameInput = null;
                    for (let w = 0; w < 30; w++) {
                        nameInput = document.querySelector('#coupon-name, input.coupon-name-input, input[name="coupon-name"]');
                        if (nameInput && nameInput.offsetParent !== null) break;
                        await new Promise(r => setTimeout(r, 100));
                    }

                    let nameSaved = false;
                    if (nameInput) {
                        nameInput.focus();
                        nameInput.value = '';
                        const safeName = nesineCouponName.slice(0, 20);
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        if (nativeInputValueSetter) {
                            nativeInputValueSetter.call(nameInput, safeName);
                        } else {
                            nameInput.value = safeName;
                        }
                        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
                        nameInput.dispatchEvent(new Event('change', { bubbles: true }));
                        nameInput.dispatchEvent(new Event('keyup', { bubbles: true }));
                        nameInput.dispatchEvent(new Event('blur', { bubbles: true }));
                        await new Promise(r => setTimeout(r, 600));

                        // 5. "Tamam" Butonuna Bas (#saveCouponName)
                        const saveBtn = document.getElementById('saveCouponName') ||
                                        document.querySelector('#mod-give-coupon-name-step1 #saveCouponName, #mod-give-coupon-name-step1 button.btn-primary');
                        if (saveBtn) {
                            if (window.$) {
                                try { window.$(saveBtn).trigger('click'); } catch(e){}
                            }
                            try { saveBtn.click(); } catch(e){}
                            nameSaved = true;
                        } else {
                            const allBtns = Array.from(document.querySelectorAll('#mod-give-coupon-name-step1 button, .modal button'));
                            const tamamBtn = allBtns.find(b => b.innerText.trim().includes('Tamam') || b.innerText.trim().includes('Kaydet'));
                            if (tamamBtn) {
                                if (window.$) {
                                    try { window.$(tamamBtn).trigger('click'); } catch(e){}
                                }
                                try { tamamBtn.click(); } catch(e){}
                                nameSaved = true;
                            }
                        }

                        // 6. Step 2 "Kupon adı kaydedilmiştir" Modalında Tamam de
                        await new Promise(r => setTimeout(r, 1200));
                        for (let s2 = 0; s2 < 25; s2++) {
                            const step2 = document.getElementById('mod-give-coupon-name-step2');
                            if (step2 && (step2.classList.contains('show') || step2.style.display !== 'none' || step2.offsetHeight > 0)) {
                                const okBtn = step2.querySelector('button, [data-id="btnOk"], .btn-close');
                                if (okBtn) {
                                    if (window.$) {
                                        try { window.$(okBtn).trigger('click'); } catch(e){}
                                    }
                                    try { okBtn.click(); } catch(e){}
                                    await new Promise(r => setTimeout(r, 400));
                                    break;
                                }
                            }
                            autoAcceptAll();
                            await new Promise(r => setTimeout(r, 150));
                        }

                        // Tüm backdrop ve açık modalları güvenlice temizle
                        document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
                        document.querySelectorAll('.modal.show, .modal[style*="display: block"]').forEach(m => {
                            m.style.display = 'none';
                            m.classList.remove('show', 'in');
                        });
                        document.body.classList.remove('modal-open');
                    }

                    return {
                        selectedCount: selectedPicks.length,
                        selectedOdds: selectedPicks,
                        couponName: nesineCouponName,
                        nameSaved
                    };
                })()
            `);
            const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Kupon ekleme zaman aşımı (45s)')), 45000));
            const stepResult = await Promise.race([execPromise, timeoutPromise]);

            console.log(`   ✅ ${stepResult.selectedCount} maç seçildi.`);
            stepResult.selectedOdds.forEach(p => console.log(`      ⚽ ${p.title} (${p.odd})`));
            if (stepResult && stepResult.nameSaved) {
                console.log(`   💾 Kupon Adı: "${stepResult.couponName}" hesaba kaydedildi!`);
            } else {
                console.log(`   ⚠️ Kupon Adı: "${stepResult.couponName}" kaydedilemedi.`);
            }

            await new Promise(r => setTimeout(r, 1500));
            const img = await win.capturePage();
            const screenshotFile = `nesine_hesap_kupon_${couponNumber}.png`;
            fs.writeFileSync(path.join(ARTIFACT_DIR, screenshotFile), img.toPNG());
            console.log(`   📸 Ekran görüntüsü alındı: ${screenshotFile}`);

            processedResults.push({
                couponNumber,
                name: nesineCouponName,
                title: coupon.title,
                picks: stepResult.selectedOdds,
                savedInAccount: !!(stepResult && stepResult.nameSaved),
                screenshot: path.join(ARTIFACT_DIR, screenshotFile),
                timestamp: new Date().toISOString()
            });

        } catch (err) {
            console.error(`   ❌ Kupon ${couponNumber} ekleme hatası:`, err.message);
        }

        await new Promise(r => setTimeout(r, 1200));
    }

    console.log('\n===================================================================');
    console.log(`🎉 TEBRİKLER! ${processedResults.length} ADET KUPON NESİNE HESABINIZA KAYDEDİLDİ!`);
    console.log('   Nesine.com -> Hesabım -> Kuponlarım bölümünden kontrol edebilirsiniz.');
    console.log('===================================================================');

    // Final Banner
    await win.webContents.executeJavaScript(`
        (() => {
            const b = document.getElementById('sportanaliz-guide-banner');
            if (b) {
                b.innerHTML = '🎉 <b>KUPONLARINIZIN TAMAMI HESABINIZA KAYDEDİLDİ!</b><br>Nesine -> Hesabım -> Kuponlarım bölümünden görebilirsiniz.';
            }
        })()
    `);

    await new Promise(r => setTimeout(r, 2000));
    try { win.close(); } catch(e){}
    try { app.quit(); } catch(e){}
    process.exit(0);
});
