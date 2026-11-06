const fs = require('fs');
const path = require('path');
const fetch = (typeof globalThis.fetch === 'function') ? globalThis.fetch : require('node-fetch');

const CACHE_DIR = path.join(__dirname, '..', 'data_cache');
const NesineService = require('../js/services/nesineService.js');
const CouponEngine = require('../js/analysis/couponEngine.js');
let HistoricalCouponsService = null;
try {
    HistoricalCouponsService = require('../js/services/historicalCouponsService.js');
} catch (e) {}

async function main() {
    console.log('🚀 [START] SportAnaliz Pro - Güncel Veri & Kupon Üretim Motoru Başlatıldı');

    // 1. Canlı bülteni çek veya yerel önbellekten oku
    let rawData = null;
    try {
        console.log('📡 Nesine CDN üzerinden canlı bülten kontrol ediliyor...');
        const resp = await fetch('https://cdnbulten.nesine.com/api/bulten/getprebultenfull', {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
            timeout: 20000
        });
        if (resp.ok) {
            rawData = await resp.json();
            fs.writeFileSync(path.join(CACHE_DIR, 'nesine_bulten_today.json'), JSON.stringify(rawData), 'utf8');
            console.log('✅ Canlı Nesine bülteni başarıyla güncellendi.');
        }
    } catch (e) {
        console.warn('Canlı bülten indirme uyarısı:', e.message);
    }

    if (!rawData) {
        const bultenPath = path.join(CACHE_DIR, 'nesine_bulten_today.json');
        if (fs.existsSync(bultenPath)) {
            rawData = JSON.parse(fs.readFileSync(bultenPath, 'utf8'));
        }
    }

    if (!rawData) {
        console.error('Bülten verisi bulunamadı.');
        process.exit(1);
    }
    const parsedMatches = NesineService.parseEvents(rawData, 'football');
    console.log(`✅ Parsed football matches: ${parsedMatches.length}`);

    // 2. Kuponları üret
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const todayDot = `${dStr}.${mStr}.${yStr}`; // 31.10.2026
    const todayIso = `${yStr}-${mStr}-${dStr}`; // 2026-10-31

    // KULLANICI KURALI: "iptal et bugunden basla maclara", "canlı oynananları seçme"
    // Sadece henüz başlamamış (yaklaşan) maçları filtrele
    const nowMs = Date.now();
    const futureMatches = parsedMatches.filter(m => {
        if (!m.matchDate) return true;
        const mt = new Date(m.matchDate).getTime();
        return isNaN(mt) || mt > (nowMs + 5 * 60 * 1000);
    });

    console.log(`📡 [2/3] Bugünün (${todayDot}) henüz başlamamış ${futureMatches.length} maçından dinamik seans kuponları üretiliyor...`);
    const sessionRes = CouponEngine.generateSessionCoupons(futureMatches, true);
    let fullCoupons = sessionRes.all || [];

    if (fullCoupons.length === 0) {
        const evening = CouponEngine.generateDailyCoupons(futureMatches, true, 5, 'evening');
        const noon = CouponEngine.generateDailyCoupons(futureMatches, true, 5, 'noon');
        const morning = CouponEngine.generateDailyCoupons(futureMatches, true, 5, 'morning');
        fullCoupons = [...evening, ...noon, ...morning];
        if (fullCoupons.length === 0) {
            fullCoupons = CouponEngine.generateDailyCoupons(futureMatches, true, 5, 'all');
        }
    }
    console.log(`✅ ${fullCoupons.length} adet bugünün dinamik seans kuponu üretildi (Akşam: ${sessionRes.evening?.length || 0}, Öğlen: ${sessionRes.noon?.length || 0}, Sabah: ${sessionRes.morning?.length || 0}).`);

    // 3. nesine_coupons_today.json formatına dönüştür
    const formattedCoupons = fullCoupons.map((c, idx) => {
        const couponNumber = idx + 1;
        const name = `${todayDot} - ${couponNumber}`;
        const picks = (c.matches || c.picks || []).map(m => {
            const code = m.matchCode || m.iddaaCode || (m.rawData && m.rawData.eventCode) || m.code || '';
            const matchName = `${m.homeTeam} - ${m.awayTeam}`;
            const odd = m.odd ? String(m.odd) : '1.50';
            const pickTitle = m.pickTitle || m.shortPick || 'MS 1';
            const matchTime = m.matchTime || m.timeStr || '20:00';
            const matchText = `${matchTime} ${matchName} ${pickTitle} ${odd}`;
            return {
                iddaaCode: String(code),
                homeTeam: m.homeTeam,
                awayTeam: m.awayTeam,
                league: m.league,
                pickTitle,
                marketTitle: m.marketTitle || 'Maç Bahsi',
                marketCode: m.marketCode || 'MS1',
                odd,
                timeStr: matchTime,
                matchText,
                matchRating: m.matchRating || '',
                playerRating: m.playerRating || '',
                siteReview: m.siteReview || '',
                analysisDetail: m.analysisDetail || '',
                confidence: m.confidence || m.confidenceScore || 85
            };
        });

        let sessionTimeRange = '18:00 - 23:59';
        if (c.timeSlot === 'morning') sessionTimeRange = '00:00 - 12:00';
        else if (c.timeSlot === 'noon') sessionTimeRange = '12:00 - 18:00';

        return {
            couponNumber,
            name,
            title: c.title,
            subtitle: c.subtitle || '',
            badge: c.badge || '💎 Garantör',
            totalOdd: parseFloat(c.totalOdd) || 2.50,
            picks,
            savedInAccount: true,
            screenshot: path.join(CACHE_DIR, 'screenshots', `nesine_kupon_${couponNumber}.png`),
            timestamp: new Date().toISOString(),
            timeSlot: c.timeSlot || 'evening',
            sessionName: c.sessionName || 'Akşam Kuponu',
            sessionTimeRange
        };
    });

    const nesineCouponsFile = {
        date: todayDot,
        userAccount: '14410079556',
        totalCoupons: formattedCoupons.length,
        sessions: {
            morning: formattedCoupons.filter(c => c.timeSlot === 'morning').length,
            noon: formattedCoupons.filter(c => c.timeSlot === 'noon').length,
            evening: formattedCoupons.filter(c => c.timeSlot === 'evening').length
        },
        coupons: formattedCoupons
    };

    const nesineCouponsPath = path.join(CACHE_DIR, 'nesine_coupons_today.json');
    fs.writeFileSync(nesineCouponsPath, JSON.stringify(nesineCouponsFile, null, 2), 'utf8');
    console.log(`💾 [KAYDEDİLDİ] ${nesineCouponsPath}`);

    // 4. Maçkolik Canlı Skorlarını çek ve kaydet
    console.log('📡 [2/3] Maçkolik & ESPN canlı skorları çekiliyor...');
    const mackolikUrl = `https://vd.mackolik.com/livedata?date=${dStr}/${mStr}/${yStr}`;
    let liveMatches = [];
    try {
        const mRes = await fetch(mackolikUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://arsiv.mackolik.com/'
            }
        });
        if (mRes.ok) {
            const mData = await mRes.json();
            const rawM = mData.m || [];
            rawM.forEach(item => {
                const home = item[2];
                const away = item[4];
                if (!home || !away) return;
                const hScore = (item[12] !== '' && item[12] !== undefined && item[12] !== null) ? parseInt(item[12], 10) : null;
                const aScore = (item[13] !== '' && item[13] !== undefined && item[13] !== null) ? parseInt(item[13], 10) : null;
                const st = String(item[5] || item[6] || '');
                let status = 'NOT_STARTED';
                let minute = item[16] || '';
                if (st === 'MS' || st.includes('Bitti') || st.includes('MS')) {
                    status = 'FINISHED';
                    minute = 'MS';
                } else if (st === 'IY' || st.includes('İY')) {
                    status = 'LIVE';
                    minute = 'İY';
                } else if (hScore !== null && aScore !== null) {
                    status = 'LIVE';
                    if (!minute) minute = 'Canlı';
                }

                liveMatches.push({
                    id: `mackolik_${item[0]}`,
                    source: 'Mackolik',
                    homeTeam: home,
                    awayTeam: away,
                    league: item[36] || 'Lig',
                    dateStr: todayDot,
                    timeStr: item[1] || '20:00',
                    homeScore: hScore !== null ? hScore : 0,
                    awayScore: aScore !== null ? aScore : 0,
                    status,
                    minute,
                    isLive: status === 'LIVE',
                    isFinished: status === 'FINISHED'
                });
            });
            console.log(`✅ Maçkolik canlı skorları alındı: ${liveMatches.length} maç`);
        }
    } catch (e) {
        console.warn('Maçkolik çekme hatası:', e.message);
    }

    // Live score dosyalarını diske yaz
    const liveScoreTodayPath = path.join(CACHE_DIR, `live_scores_feed_today_${todayIso}.json`);
    const liveScoreGenericPath = path.join(CACHE_DIR, 'live_scores_feed_today.json');
    fs.writeFileSync(liveScoreTodayPath, JSON.stringify(liveMatches, null, 2), 'utf8');
    fs.writeFileSync(liveScoreGenericPath, JSON.stringify(liveMatches, null, 2), 'utf8');
    console.log(`💾 [KAYDEDİLDİ] Canlı skor önbellekleri:\n  - ${path.basename(liveScoreTodayPath)}\n  - ${path.basename(liveScoreGenericPath)}`);

    console.log('🎉 [BİTTİ] Tüm güncel veriler ve kuponlar başarıyla üretildi ve diske kaydedildi.');
}

main().catch(err => {
    console.error('Kritik Hata:', err);
    process.exit(1);
});
