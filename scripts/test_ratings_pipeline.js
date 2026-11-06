const fs = require('fs');
const NesineService = require('../js/services/nesineService.js');
const raw = JSON.parse(fs.readFileSync('data_cache/nesine_bulten_today.json', 'utf8'));
const matches = NesineService.parseEvents(raw, 'football');

const SquadRatingEngine = require('../js/analysis/squadRatingEngine.js');
const SofascoreService = require('../js/services/sofascoreService.js');
const EditorEngine = require('../js/analysis/editorEngine.js');

const sample = matches.slice(0, 3);

sample.forEach((m, idx) => {
    console.log(`\n========================================`);
    console.log(`MAÇ ${idx+1}: ${m.homeTeam} vs ${m.awayTeam} (${m.timeStr})`);
    console.log(`========================================`);

    const squad = SquadRatingEngine.generateSquadAnalysis(m);
    const sofa = SofascoreService.getMatchAnalytics(m);
    const editor = EditorEngine.evaluate(null, m, null);

    const matchRatingStr = `SofaScore: ${sofa.ratings.home} vs ${sofa.ratings.away} (Fark: ${sofa.ratings.diff > 0 ? '+' : ''}${sofa.ratings.diff}) | Topla Oynama: %${sofa.homePossession}-%${sofa.awayPossession}`;
    const playerRatingStr = `İlk 11 Ortalaması: ${squad.homeSquad.averages.overall11} vs ${squad.awaySquad.averages.overall11} | Düello: ${squad.duels.homeAttackVsAwayDefense.verdict} | Yıldız: ${squad.homeSquad.topFormPlayer.name} (${squad.homeSquad.topFormPlayer.avgRating} ${squad.homeSquad.topFormPlayer.trendIcon})`;
    
    let siteReviewStr = '4 Platform (Nesine, Bilyoner, Misli, İddaa) Analist Konsensüsü';
    if (m.editorChoices && m.editorChoices.length > 0) {
        const topChoice = m.editorChoices[0];
        siteReviewStr = `Nesine.com (${topChoice.name}): ${topChoice.outcomeName} (${topChoice.odd}) · ${m.editorChoices.length} Uzman Yorumu Mevcut`;
    }

    console.log('📊 Maç Reytingi:', matchRatingStr);
    console.log('🏃 Oyuncu Reytingi:', playerRatingStr);
    console.log('✍️ Site Yorumu:', siteReviewStr);
});

