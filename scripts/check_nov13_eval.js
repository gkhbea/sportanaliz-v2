const fs = require('fs');
const { execSync } = require('child_process');

// 13.11 kuponlarını alalım (git show 77be335:data_cache/nesine_coupons_today.json)
const raw13 = execSync('git show 77be335:data_cache/nesine_coupons_today.json').toString();
const data13 = JSON.parse(raw13);

console.log("Date:", data13.date);
console.log("Total Coupons:", data13.coupons.length);

// 14.11 sabahı kaydedilen canlı skor feed'ini yükle (13.11 akşam maçları bitmiş haldedir)
const scores14 = JSON.parse(fs.readFileSync('data_cache/live_scores_feed_today_2026-11-14.json', 'utf8'));

console.log("Total scores in feed 14.11:", scores14.length);

// Skor haritası çıkaralım
const scoreMap = {};
scores14.forEach(m => {
    const key = `${m.homeTeam} - ${m.awayTeam}`.toLowerCase();
    scoreMap[key] = m;
    if (m.id) scoreMap[m.id] = m;
});

data13.coupons.forEach(c => {
    console.log(`\n🎫 Kupon ${c.couponNumber}: ${c.title} (Oran: ${c.totalOdd})`);
    c.picks.forEach(p => {
        console.log(`   - ${p.homeTeam} vs ${p.awayTeam} | Tercih: ${p.pickTitle} (${p.odd})`);
    });
});

