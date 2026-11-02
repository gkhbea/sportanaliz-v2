const s = require('../js/services/historicalCouponsService.js');
s.invalidateCache();
const sets = s.getAllCouponSets();
console.log('Total sets count:', sets.length);
const last3 = sets.slice(-3);
last3.forEach(set => {
    console.log(`- ${set.date} (${set.dateFormatted}, ${set.dayName}): ${set.coupons.length} kupon, Konsept: ${set.concept}`);
});

const todayCoupons = s.getCouponsByDate('2026-11-03');
console.log('\n2026-11-03 Kuponları:', todayCoupons.length);
todayCoupons.slice(0, 3).forEach((c, idx) => {
    console.log(`  Kupon #${c.couponNumber} [${c.sessionName || c.timeSlot}]: ${c.title} (Oran: ${c.totalOdd})`);
    c.picks.forEach(p => console.log(`     * ${p.homeTeam} vs ${p.awayTeam} -> ${p.pickTitle} (${p.odd}) [Kod: ${p.iddaaCode}]`));
});
