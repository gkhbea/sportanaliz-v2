const fs = require('fs');
const path = require('path');

const HistoricalCouponsService = require('../js/services/historicalCouponsService.js');
const CouponEngine = require('../js/analysis/couponEngine.js');
const NesineService = require('../js/services/nesineService.js');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
    totalTests++;
    if (condition) {
        passedTests++;
        console.log(`  ✅ [GEÇTİ] ${testName}`);
    } else {
        failedTests++;
        console.error(`  ❌ [BAŞARISIZ] ${testName} -> ${details}`);
    }
}

function verifyCouponSet(couponList, setName) {
    console.log(`\n======================================================`);
    console.log(`🔍 [DENETİM] ${setName} (${couponList.length} Kupon İnceleniyor)`);
    console.log(`======================================================`);

    const matchUsage = new Map(); // matchKey -> array of { couponNumber, pickTitle, marketCode }

    couponList.forEach(coupon => {
        const slot = coupon.timeSlot;
        const cNum = coupon.couponNumber || coupon.id;
        const picks = coupon.picks || coupon.matches || [];

        assert(
            slot === 'morning' || slot === 'noon' || slot === 'evening',
            `Kupon #${cNum} geçerli bir seans zaman dilimine sahip: ${slot}`,
            `Geçersiz timeSlot: ${slot}`
        );

        picks.forEach(p => {
            const timeStr = p.timeStr || (p.match && p.match.timeStr) || '';
            const odd = parseFloat(p.odd) || 0;
            const home = p.homeTeam || (p.match && p.match.homeTeam) || 'Ev';
            const away = p.awayTeam || (p.match && p.match.awayTeam) || 'Dep';
            const matchKey = `${home}_${away}`;
            const parts = timeStr.split(':');
            const hour = parseInt(parts[0], 10);

            // 1. Minimum Oran 1.20 Denetimi
            assert(
                odd >= 1.20,
                `Kupon #${cNum} - ${home} vs ${away} oran >= 1.20 (${odd})`,
                `Oran 1.20 altında: ${odd}`
            );

            // 2. Kesin Seans Saat Aralığı Denetimi
            if (slot === 'morning') {
                assert(
                    hour >= 0 && hour < 12,
                    `Kupon #${cNum} [SABAH] - ${timeStr} ${home} vs ${away} (00:00 - 12:00 aralığında)`,
                    `Saat 00:00 - 12:00 dışında: ${timeStr} (Saat: ${hour})`
                );
            } else if (slot === 'noon') {
                assert(
                    hour >= 12 && hour < 18,
                    `Kupon #${cNum} [ÖĞLEN] - ${timeStr} ${home} vs ${away} (12:00 - 18:00 aralığında)`,
                    `Saat 12:00 - 18:00 dışında: ${timeStr} (Saat: ${hour})`
                );
            } else if (slot === 'evening') {
                assert(
                    hour >= 18 && hour <= 23,
                    `Kupon #${cNum} [AKŞAM] - ${timeStr} ${home} vs ${away} (18:00 - 23:59 aralığında)`,
                    `Saat 18:00 - 23:59 dışında: ${timeStr} (Saat: ${hour})`
                );
            }

            if (!matchUsage.has(matchKey)) {
                matchUsage.set(matchKey, []);
            }
            matchUsage.get(matchKey).push({
                couponNumber: cNum,
                pickTitle: p.pickTitle || p.shortPick,
                marketCode: p.marketCode
            });
        });
    });

    // 3. Maç Tekrar Sayısı (En Fazla 2) ve Farklı Bahis Seçeneği Denetimi
    matchUsage.forEach((usages, matchKey) => {
        assert(
            usages.length <= 2,
            `Maç Kullanım Limiti: "${matchKey}" en fazla 2 kez kullanılmış (Toplam: ${usages.length})`,
            `2'den fazla kullanıldı: ${usages.length} kez (${usages.map(u => '#' + u.couponNumber).join(', ')})`
        );

        if (usages.length === 2) {
            const u1 = usages[0];
            const u2 = usages[1];
            const diffMarket = (u1.marketCode !== u2.marketCode) || (u1.pickTitle !== u2.pickTitle);
            assert(
                diffMarket,
                `Farklı Bahis Tercihi: "${matchKey}" 2 kullanımında farklı seçenekler (#${u1.couponNumber}: ${u1.pickTitle} vs #${u2.couponNumber}: ${u2.pickTitle})`,
                `Aynı tercih tekrarlandı!`
            );
        }
    });
}

// 1. Test: nesine_coupons_today.json
const nesineCouponsPath = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
if (fs.existsSync(nesineCouponsPath)) {
    const data = JSON.parse(fs.readFileSync(nesineCouponsPath, 'utf8'));
    verifyCouponSet(data.coupons || [], 'nesine_coupons_today.json (Bugünün Kuponları)');
}

// 2. Test: HistoricalCouponsService (03.11.2026)
const histCoupons = HistoricalCouponsService.getCouponsByDate('2026-11-03') || [];
verifyCouponSet(histCoupons, 'HistoricalCouponsService (03.11.2026)');

// 3. Test: Dinamik CouponEngine (Bülten üzerinden Seans Üretimi)
const nesineBultenPath = path.join(__dirname, '..', 'data_cache', 'nesine_bulten_today.json');
if (fs.existsSync(nesineBultenPath)) {
    const raw = JSON.parse(fs.readFileSync(nesineBultenPath, 'utf8'));
    const parsedMatches = NesineService.parseEvents(raw, 'football');
    const sessionRes = CouponEngine.generateSessionCoupons(parsedMatches, true);
    verifyCouponSet(sessionRes.all, 'CouponEngine.generateSessionCoupons (Dinamik Canlı Bülten)');
}

console.log(`\n======================================================`);
console.log(`📊 TEST SONUÇLARI:`);
console.log(`   Toplam Test: ${totalTests}`);
console.log(`   Başarılı:   ${passedTests}`);
console.log(`   Başarısız:  ${failedTests}`);
console.log(`======================================================`);

if (failedTests > 0) {
    process.exit(1);
} else {
    console.log(`🎉 TÜM SEANS KURALLARI %100 DOĞRULANDI VE GEÇTİ!`);
}
