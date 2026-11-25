const fs = require('fs');
const path = require('path');

// 1. Güncel nesine_coupons_today.json'u oku
const todayPath = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
if (fs.existsSync(todayPath)) {
    const data = JSON.parse(fs.readFileSync(todayPath, 'utf8'));
    console.log(`=== GÜNCEL KUPON DOSYASI ===`);
    console.log(`Tarih: ${data.date}`);
    console.log(`Hesap: ${data.userAccount}`);
    console.log(`Toplam Kupon: ${data.totalCoupons}`);
    if (data.coupons && data.coupons.length > 0) {
        console.log(`İlk 3 Kupon:`);
        data.coupons.slice(0, 3).forEach(c => {
            console.log(`  - Kupon ${c.couponNumber}: ${c.title} (Oran: ${c.totalOdd}) [${c.sessionName}]`);
            (c.picks || []).forEach(p => {
                console.log(`      * ${p.homeTeam} - ${p.awayTeam} | ${p.pickTitle} (${p.odd})`);
            });
        });
    }
}

// 2. 17.11 maç sonuçlarını kontrol et
const score17Path = path.join(__dirname, '..', 'data_cache', 'live_scores_feed_today_2026-11-17.json');
if (fs.existsSync(score17Path)) {
    const scores17 = JSON.parse(fs.readFileSync(score17Path, 'utf8'));
    console.log(`\n17.11 Canlı Skor Feed Boyutu: ${scores17.length} maç`);
}
