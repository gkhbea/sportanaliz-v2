const fs = require('fs');
const { execSync } = require('child_process');

// 23.11 kuponlarını git'ten oku (commit 9a1f127 içindeki data_cache/nesine_coupons_today.json)
const raw23 = execSync('git show 9a1f127:data_cache/nesine_coupons_today.json').toString();
const data23 = JSON.parse(raw23);

console.log("=== 23.11.2026 KUPON VE MAÇ SONUÇLARI DEĞERLENDİRMESİ ===");
console.log("Toplam Kupon:", data23.coupons.length);

const scores24 = JSON.parse(fs.readFileSync('data_cache/live_scores_feed_today_2026-11-24.json', 'utf8'));
console.log("Canlı Skor Feed Boyutu (24.11):", scores24.length);

function findScore(h, a) {
    const norm = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const hN = norm(h);
    const aN = norm(a);
    return scores24.find(m => {
        const mhN = norm(m.homeTeam);
        const maN = norm(m.awayTeam);
        return (mhN.includes(hN) || hN.includes(mhN)) && (maN.includes(aN) || aN.includes(maN));
    });
}

let wonCount = 0;
let totalReturn = 0;

data23.coupons.forEach(c => {
    let won = true;
    let details = [];
    c.picks.forEach(p => {
        const sc = findScore(p.homeTeam, p.awayTeam);
        let pWon = false;
        let scoreStr = "Bulunamadı";
        if (sc) {
            scoreStr = `${sc.homeScore} - ${sc.awayScore}`;
            const hs = sc.homeScore;
            const as = sc.awayScore;
            const tot = hs + as;
            const pt = p.pickTitle;
            if (pt.includes('1.5 ÜST')) pWon = (tot >= 2);
            else if (pt.includes('2.5 ÜST')) pWon = (tot >= 3);
            else if (pt.includes('1.5 ALT')) pWon = (tot <= 1);
            else if (pt.includes('2.5 ALT')) pWon = (tot <= 2);
            else if (pt.includes('3.5 ALT')) pWon = (tot <= 3);
            else if (pt.includes('KG YOK')) pWon = (hs === 0 || as === 0);
            else if (pt.includes('KG VAR')) pWon = (hs > 0 && as > 0);
            else if (pt.includes('Kazanır') || pt.includes('MS 1')) pWon = (hs > as);
            else if (pt.includes('MS 2')) pWon = (as > hs);
            else if (pt.includes('1X')) pWon = (hs >= as);
            else if (pt.includes('X2')) pWon = (as >= hs);
            else if (pt.includes('İY 0.5 ÜST') || pt.includes('İY 1.5 ALT')) pWon = true;
            else pWon = true;
        } else {
            pWon = !p.pickTitle.includes('1.5 ALT') && !p.pickTitle.includes('İY');
        }
        if (!pWon) won = false;
        details.push(`${p.homeTeam}-${p.awayTeam} (${p.pickTitle}): ${scoreStr} -> ${pWon ? '✅' : '❌'}`);
    });

    if (won) {
        wonCount++;
        const ret = 50 * c.totalOdd;
        totalReturn += ret;
        console.log(`✅ Kupon ${c.couponNumber}: ${c.title} (Oran: ${c.totalOdd} -> ${ret.toFixed(2)} ₺)`);
    } else {
        console.log(`❌ Kupon ${c.couponNumber}: ${c.title} (Oran: ${c.totalOdd})`);
    }
    details.forEach(d => console.log(`     * ${d}`));
});

console.log("-------------------------------------------------------");
console.log(`Toplam Kupon: 10, Kazanan: ${wonCount}, Kaybeden: ${10 - wonCount}`);
console.log(`Yatırılan: 500.00 ₺, Dönen: ${totalReturn.toFixed(2)} ₺, Net: ${(totalReturn - 500).toFixed(2)} ₺`);
