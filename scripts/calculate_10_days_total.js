/**
 * calculate_10_days_total.js
 * 10 Günlük Kesin Kâr/Zarar, Yatırılan ve Kazanılan Tutar Hesaplayıcı (06.11 - 15.11)
 * Sabit 50 TL Kuralı ile
 */

const STARTING_CAPITAL = 1000.00;
const STAKE = 50.00;

const days = [
    { date: "06.11.2026", day: "Cuma", total: 10, won: 4, lost: 6, ret: 627.50 },
    { date: "07.11.2026", day: "Cumartesi", total: 5, won: 4, lost: 1, ret: 692.00 },
    { date: "08.11.2026", day: "Pazar", total: 5, won: 4, lost: 1, ret: 603.50 },
    { date: "09.11.2026", day: "Pazartesi", total: 12, won: 7, lost: 5, ret: 885.00 },
    { date: "10.11.2026", day: "Salı", total: 10, won: 6, lost: 4, ret: 735.00 },
    { date: "11.11.2026", day: "Çarşamba", total: 10, won: 6, lost: 4, ret: 712.50 },
    { date: "12.11.2026", day: "Perşembe", total: 13, won: 8, lost: 5, ret: 1032.50 },
    { date: "13.11.2026", day: "Cuma", total: 15, won: 7, lost: 8, ret: 992.50 },
    { date: "14.11.2026", day: "Cumartesi", total: 8, won: 5, lost: 3, ret: 665.00 },
    { date: "15.11.2026", day: "Pazar", total: 8, won: 5, lost: 3, ret: 685.00 }
];

let totalCoupons = 0;
let totalWon = 0;
let totalLost = 0;
let totalStaked = 0;
let totalReturned = 0;
let runningBankroll = STARTING_CAPITAL;

console.log("===============================================================================");
console.log("  ⚡ SPORTANALIZ PRO — 10 GÜNLÜK NET KÂR / ZARAR VE PERFORMANS TABLOSU");
console.log("  📅 Tarih Aralığı: 06.11.2026 - 15.11.2026 (Tam 10 Gün)");
console.log("  🎯 Kural: Kupon Başına Sabit 50 TL (Flat Stake)");
console.log("===============================================================================");

days.forEach((d, idx) => {
    const stake = d.total * STAKE;
    const net = d.ret - stake;
    runningBankroll += net;
    totalCoupons += d.total;
    totalWon += d.won;
    totalLost += d.lost;
    totalStaked += stake;
    totalReturned += d.ret;

    console.log(
        `${String(idx + 1).padStart(2)}. Gün: ${d.date} (${d.day.padEnd(10)}) | ` +
        `Kupon: ${String(d.total).padStart(2)} (${d.won} T / ${d.lost} Y) | ` +
        `Yatırılan: ${stake.toFixed(2).padStart(7)} ₺ | ` +
        `Alınan: ${d.ret.toFixed(2).padStart(7)} ₺ | ` +
        `Net: ${(net >= 0 ? '+' : '') + net.toFixed(2).padStart(7)} ₺ | ` +
        `Kasa: ${runningBankroll.toFixed(2).padStart(7)} ₺`
    );
});

const totalNetProfit = totalReturned - totalStaked;
const winRate = (totalWon / totalCoupons) * 100;
const roi = (totalNetProfit / totalStaked) * 100;
const growth = ((runningBankroll - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;

console.log("===============================================================================");
console.log("💰 GENEL FİNANSAL BİLANÇO (10 GÜN):");
console.log(`💵 Başlangıç Kasası       : ${STARTING_CAPITAL.toFixed(2)} ₺`);
console.log(`📥 Toplam Yatırılan Tutar : ${totalStaked.toFixed(2)} ₺  (${totalCoupons} kupon x 50 ₺)`);
console.log(`📤 Toplam Alınan/Dönen    : ${totalReturned.toFixed(2)} ₺  (Kazanılan kuponlardan)`);
console.log(`📈 TOPLAM NET KÂR         : +${totalNetProfit.toFixed(2)} ₺`);
console.log(`🏦 Güncel Kasa (Bakiye)    : ${runningBankroll.toFixed(2)} ₺`);
console.log(`🚀 Kasa Büyüme Oranı      : +%${growth.toFixed(1)}`);
console.log(`📊 Yatırım ROI (Yield)    : +%${roi.toFixed(1)}`);
console.log("-------------------------------------------------------------------------------");
console.log(`🎫 Toplam Oynanan Kupon   : ${totalCoupons} adet`);
console.log(`✅ Tutan Kupon Sayısı     : ${totalWon} adet`);
console.log(`❌ Yatan Kupon Sayısı     : ${totalLost} adet`);
console.log(`🎯 Kupon Başarı Yüzdesi   : %${winRate.toFixed(1)}`);
console.log("===============================================================================");

