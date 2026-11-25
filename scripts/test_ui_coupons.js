const path = require('path');
const fs = require('fs');

global.window = global;
global.localStorage = { getItem: () => null, setItem: () => {} };
require('../js/utils/statistics.js');
require('../js/analysis/poissonModel.js');
require('../js/analysis/footballAnalysis.js');
require('../js/analysis/riskEngine.js');
require('../js/analysis/couponEngine.js');
require('../js/services/historicalCouponsService.js');
require('../js/components/couponPanel.js');

const coupons = window.CouponPanel.getCouponsForDate('2026-11-23');
console.log("=== UI KUPON YÜKLEME TESTİ ===");
console.log("Dönen Kupon Sayısı:", coupons ? coupons.length : 0);
if (coupons && coupons.length > 0) {
    console.log("İlk Kupon:", coupons[0].title);
    console.log("Maçlar:");
    (coupons[0].picks || []).forEach(p => {
        console.log(`  - ${p.homeTeam} vs ${p.awayTeam} | ${p.pickTitle} (${p.odd})`);
    });
}
