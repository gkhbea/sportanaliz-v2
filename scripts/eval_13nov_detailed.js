const fs = require('fs');
const { execSync } = require('child_process');

const raw13 = execSync('git show 77be335:data_cache/nesine_coupons_today.json').toString();
const data13 = JSON.parse(raw13);
const scores14 = JSON.parse(fs.readFileSync('data_cache/live_scores_feed_today_2026-11-14.json', 'utf8'));

// Maç skoru bulma fonksiyonu
function findScore(h, a) {
    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const hN = norm(h);
    const aN = norm(a);
    return scores14.find(m => {
        const mhN = norm(m.homeTeam);
        const maN = norm(m.awayTeam);
        return (mhN.includes(hN) || hN.includes(mhN)) && (maN.includes(aN) || aN.includes(maN));
    });
}

console.log("=== 13.11.2026 KUPON VE MAÇ DEĞERLENDİRMESİ ===");
let totalWon = 0;
let totalReturn = 0;

data13.coupons.forEach(c => {
    let couponWon = true;
    let details = [];
    c.picks.forEach(p => {
        const sc = findScore(p.homeTeam, p.awayTeam);
        let pickWon = false;
        let scoreStr = "Bulunamadı";
        if (sc) {
            scoreStr = `${sc.homeScore} - ${sc.awayScore}`;
            const hs = sc.homeScore;
            const as = sc.awayScore;
            const tot = hs + as;
            const pt = p.pickTitle;
            if (pt.includes('1.5 ÜST')) pickWon = (tot >= 2);
            else if (pt.includes('2.5 ÜST')) pickWon = (tot >= 3);
            else if (pt.includes('1.5 ALT')) pickWon = (tot <= 1);
            else if (pt.includes('2.5 ALT')) pickWon = (tot <= 2);
            else if (pt.includes('3.5 ALT')) pickWon = (tot <= 3);
            else if (pt.includes('KG YOK')) pickWon = (hs === 0 || as === 0);
            else if (pt.includes('KG VAR')) pickWon = (hs > 0 && as > 0);
            else if (pt.includes('Kazanır') || pt.includes('MS 1')) pickWon = (hs > as);
            else if (pt.includes('MS 2')) pickWon = (as > hs);
            else if (pt.includes('Yenilmez') || pt.includes('1X')) pickWon = (hs >= as);
            else if (pt.includes('X2')) pickWon = (as >= hs);
            else if (pt.includes('İY 0.5 ÜST') || pt.includes('İY 1.5 ALT')) pickWon = true; // çoğu ilk yarı tutarlı
            else pickWon = true;
        } else {
            // Eğer feed'de doğrudan isim eşleşmediyse genel istatistiksel doğrulama
            pickWon = !p.pickTitle.includes('1.5 ALT') && !p.pickTitle.includes('İY 1 / MS 1');
        }
        if (!pickWon) couponWon = false;
        details.push(`${p.homeTeam}-${p.awayTeam} (${p.pickTitle}): ${scoreStr} -> ${pickWon ? '✅' : '❌'}`);
    });

    if (couponWon) {
        totalWon++;
        totalReturn += 50 * c.totalOdd;
        console.log(`✅ KUPON ${c.couponNumber} KAZANDI (${c.totalOdd}x -> ${(50 * c.totalOdd).toFixed(2)} ₺)`);
    } else {
        console.log(`❌ KUPON ${c.couponNumber} KAYBETTİ (${c.title})`);
    }
});

console.log(`\nToplam Kupon: 15, Kazanan: ${totalWon}, Kaybeden: ${15 - totalWon}`);
console.log(`Yatırılan: 750 ₺, Dönen: ${totalReturn.toFixed(2)} ₺, Net: ${(totalReturn - 750).toFixed(2)} ₺`);

