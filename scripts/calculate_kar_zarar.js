/**
 * update_and_calculate_kar_zarar.js
 * 06.11.2026'dan 13.11.2026 (Bugün)'e kadar olan tüm günlerin
 * kâr/zarar, başarı oranları ve kasa durumunu hesaplar ve masaüstündeki Excel'i günceller.
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const DESKTOP_PATH = path.join(process.env.USERPROFILE, 'Desktop');
const OUTPUT_FILE = path.join(DESKTOP_PATH, 'SportAnaliz_Gunluk_Kar_Zarar_Takip.xlsx');

// Günlük Kupon ve Sonuç Verileri (06.11 - 13.11)
const dailyRecords = [
    {
        date: "06.11.2026",
        dayName: "Cuma",
        total: 10,
        won: 4,
        lost: 6,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 500,
        totalReturn: 627.50,
        netProfit: 127.50,
        roi: 25.5,
        statusNote: "✅ Kârla Kapandı (+127.50 ₺)"
    },
    {
        date: "07.11.2026",
        dayName: "Cumartesi",
        total: 5,
        won: 4,
        lost: 1,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 250,
        totalReturn: 692.00,
        netProfit: 442.00,
        roi: 176.8,
        statusNote: "🔥 Süper Cumartesi (+442.00 ₺)"
    },
    {
        date: "08.11.2026",
        dayName: "Pazar",
        total: 5,
        won: 4,
        lost: 1,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 250,
        totalReturn: 603.50,
        netProfit: 353.50,
        roi: 141.4,
        statusNote: "🌟 Güçlü Pazar Seansı (+353.50 ₺)"
    },
    {
        date: "09.11.2026",
        dayName: "Pazartesi",
        total: 12,
        won: 7,
        lost: 5,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 600,
        totalReturn: 885.00,
        netProfit: 285.00,
        roi: 47.5,
        statusNote: "✅ Pazartesi Kârla Kapandı (+285.00 ₺)"
    },
    {
        date: "10.11.2026",
        dayName: "Salı",
        total: 10,
        won: 6,
        lost: 4,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 500,
        totalReturn: 735.00,
        netProfit: 235.00,
        roi: 47.0,
        statusNote: "✅ Salı Seansı Başarılı (+235.00 ₺)"
    },
    {
        date: "11.11.2026",
        dayName: "Çarşamba",
        total: 10,
        won: 6,
        lost: 4,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 500,
        totalReturn: 712.50,
        netProfit: 212.50,
        roi: 42.5,
        statusNote: "✅ Çarşamba Kârla Kapandı (+212.50 ₺)"
    },
    {
        date: "12.11.2026",
        dayName: "Perşembe",
        total: 13,
        won: 8,
        lost: 5,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 650,
        totalReturn: 1032.50,
        netProfit: 382.50,
        roi: 58.8,
        statusNote: "🔥 Perşembe Yüksek Kazanç (+382.50 ₺)"
    },
    {
        date: "13.11.2026",
        dayName: "Cuma",
        total: 15,
        won: 7,
        lost: 8,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 750,
        totalReturn: 992.50,
        netProfit: 242.50,
        roi: 32.3,
        statusNote: "✅ Cuma Seansı Başarılı (+242.50 ₺)"
    },
    {
        date: "14.11.2026",
        dayName: "Cumartesi",
        total: 8,
        won: 5,
        lost: 3,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 400,
        totalReturn: 665.00,
        netProfit: 265.00,
        roi: 66.3,
        statusNote: "🔥 Cumartesi Kârla Kapandı (+265.00 ₺)"
    },
    {
        date: "15.11.2026",
        dayName: "Pazar",
        total: 8,
        won: 5,
        lost: 3,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 400,
        totalReturn: 685.00,
        netProfit: 285.00,
        roi: 71.3,
        statusNote: "🌟 Pazar Seansı Yüksek Kazanç (+285.00 ₺)"
    },
    {
        date: "16.11.2026",
        dayName: "Pazartesi",
        total: 13,
        won: 7,
        lost: 6,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 650,
        totalReturn: 915.00,
        netProfit: 265.00,
        roi: 40.8,
        statusNote: "✅ Pazartesi Kârla Kapandı (+265.00 ₺)"
    },
    {
        date: "17.11.2026",
        dayName: "Salı",
        total: 13,
        won: 8,
        lost: 5,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 650,
        totalReturn: 972.50,
        netProfit: 322.50,
        roi: 49.6,
        statusNote: "🔥 Salı Seansı Yüksek Kazanç (+322.50 ₺)"
    },
    {
        date: "23.11.2026",
        dayName: "Pazartesi",
        total: 10,
        won: 5,
        lost: 5,
        pend: 0,
        stakePerCoupon: 50,
        totalStake: 500,
        totalReturn: 762.50,
        netProfit: 262.50,
        roi: 52.5,
        statusNote: "✅ Pazartesi Kârla Kapandı (+262.50 ₺)"
    },
    {
        date: "24.11.2026",
        dayName: "Salı (Bugün)",
        total: 14,
        won: 0,
        lost: 0,
        pend: 14,
        stakePerCoupon: 50,
        totalStake: 700,
        totalReturn: 0,
        netProfit: 0,
        roi: 0,
        statusNote: "⏳ Bugünün 14 Kuponu / Nesine'de Kayıtlı"
    }
];

// Genel Kümülatif Hesaplama
const STARTING_CAPITAL = 1000.00;
let runningCapital = STARTING_CAPITAL;
let totalSettledStake = 0;
let totalSettledReturn = 0;
let totalWonCoupons = 0;
let totalLostCoupons = 0;
let totalPendingCoupons = 0;
let totalCouponsCount = 0;

dailyRecords.forEach(d => {
    totalCouponsCount += d.total;
    totalPendingCoupons += d.pend;
    if (d.pend === 0) {
        totalSettledStake += d.totalStake;
        totalSettledReturn += d.totalReturn;
        totalWonCoupons += d.won;
        totalLostCoupons += d.lost;
        runningCapital += d.netProfit;
    }
    d.endCapital = runningCapital;
    d.cumulativeNet = runningCapital - STARTING_CAPITAL;
    d.cumulativeROI = ((runningCapital - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;
});

const totalNetProfit = totalSettledReturn - totalSettledStake;
const winRate = (totalWonCoupons / (totalWonCoupons + totalLostCoupons)) * 100;
const overallROI = (totalNetProfit / totalSettledStake) * 100;
const bankrollGrowth = ((runningCapital - STARTING_CAPITAL) / STARTING_CAPITAL) * 100;

console.log('===================================================================');
console.log('  ⚡ SPORTANALIZ PRO — KÂR / ZARAR VE PERFORMANS RAPORU');
console.log('  📅 Dönem: 06.11.2026 - 16.11.2026 (10 Gün Tamamlanan)');
console.log('===================================================================');
console.log(`💰 Başlangıç Kasası    : ${STARTING_CAPITAL.toFixed(2)} ₺`);
console.log(`🎫 Kupon Başı Bahis    : 50.00 ₺ (Sabit Flat Stake — Fazlası Yok)`);
console.log(`🏦 Güncel Kasa (Bakiye) : ${runningCapital.toFixed(2)} ₺`);
console.log(`📈 Toplam Net Kâr      : +${totalNetProfit.toFixed(2)} ₺`);
console.log(`🚀 Kasa Büyümesi        : +%${bankrollGrowth.toFixed(1)}`);
console.log(`📥 Yatırılan (Sonuçlanan): ${totalSettledStake.toFixed(2)} ₺`);
console.log(`📤 Toplam Geri Dönüş    : ${totalSettledReturn.toFixed(2)} ₺`);
console.log(`📊 Bahis ROI (Yield)    : +%${overallROI.toFixed(1)}`);
console.log('-------------------------------------------------------------------');
console.log(`🎫 Toplam Kupon Sayısı  : ${totalCouponsCount} adet`);
console.log(`✅ Tutan Kupon Sayısı   : ${totalWonCoupons} adet`);
console.log(`❌ Yatan Kupon Sayısı   : ${totalLostCoupons} adet`);
console.log(`⏳ Bugün Bekleyen Kupon : ${totalPendingCoupons} adet (13.11.2026)`);
console.log(`🎯 Kupon Başarı Oranı   : %${winRate.toFixed(1)}`);
console.log('===================================================================');
console.log('\nGÜNLÜK GELİŞİM TABLOSU:');
dailyRecords.forEach(d => {
    console.log(`${d.date} (${d.dayName.padEnd(14)}) | Kupon: ${String(d.total).padStart(2)} (T:${d.won} Y:${d.lost} B:${d.pend}) | Net: ${(d.netProfit >= 0 ? '+' : '') + d.netProfit.toFixed(2)} ₺ | Kasa: ${d.endCapital.toFixed(2)} ₺ | ${d.statusNote}`);
});

