const fs = require('fs');
const { execSync } = require('child_process');

// 17.11 kuponlarını git'ten veya loglardan bulalım
let c17Data = null;
try {
    // Check if 17.11 coupons were committed in any commit or stash
    const commits = execSync('git log --oneline -n 20 -- data_cache/nesine_coupons_today.json').toString();
    console.log("Commits for nesine_coupons_today.json:\n", commits);
} catch (e) {}

// Check data_cache/nesine_coupons_today_2026-11-17.json if exists
const p17 = 'data_cache/nesine_coupons_today_2026-11-17.json';
if (fs.existsSync(p17)) {
    c17Data = JSON.parse(fs.readFileSync(p17, 'utf8'));
    console.log("Found p17 file with", c17Data.coupons.length, "coupons");
}

// 17.11 canlı skor feed'ini kontrol et
const scores17 = JSON.parse(fs.readFileSync('data_cache/live_scores_feed_today_2026-11-17.json', 'utf8'));
console.log("Scores on 17.11:", scores17.length);
if (scores17.length > 0) {
    console.log("Sample finished matches on 17.11:");
    scores17.slice(0, 5).forEach(m => {
        console.log(`  - ${m.homeTeam} ${m.homeScore} - ${m.awayScore} ${m.awayTeam} (${m.status})`);
    });
}
