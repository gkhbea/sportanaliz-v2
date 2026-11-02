const fs = require('fs');
const path = require('path');

const bulten = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data_cache', 'nesine_bulten_today.json'), 'utf8'));
const events = bulten.sg.EA || [];

const targetCodes = [
    '3264642', // Atl Madrid vs Bayern Münih
    '3264639', // Man. Utd vs AS Roma
    '3264813', // Villarreal vs PSG
    '3265007', // Feyenoord vs Inter
    '3264867', // Barcelona vs Aston Villa
    '3264848', // Bodo Glimt vs Lille
    '3264691', // LASK vs S. Bratislava
    '3264687', // W. Bromwich vs Southampton
    '3264670', // Birmingham vs Millwall
    '3266672'  // Bragantino vs Santos SP
];

console.log('=== EXACT ODDS FOR CHAMPIONS LEAGUE & TOP MATCHES (03.11.2026) ===');
targetCodes.forEach(code => {
    const e = events.find(ev => String(ev.C) === code);
    if (!e) return console.log(`[${code}] NOT FOUND`);
    console.log(`\n------------------------------------------------------------`);
    console.log(`[Kod: ${e.C}] ${e.T} | ${e.HN} vs ${e.AN} (MBS: ${e.EMBS || 1})`);
    
    (e.MA || []).forEach(m => {
        // MTID 1: MS
        if (m.MTID === 1) {
            console.log('   Maç Sonucu (MS):', (m.OCA || []).map(o => `MS${o.N === 1 ? '1' : o.N === 2 ? 'X' : '2'}: ${o.O}`).join(' | '));
        }
        // MTID 3: ÇŞ
        if (m.MTID === 3) {
            console.log('   Çifte Şans (ÇŞ):', (m.OCA || []).map(o => `ÇŞ${o.N === 1 ? '1X' : o.N === 2 ? '12' : 'X2'}: ${o.O}`).join(' | '));
        }
        // MTID 455 or 12: 2.5 Alt/Üst
        if (m.MTID === 455 || m.MTID === 12) {
            console.log(`   2.5 Gol (MTID ${m.MTID}):`, (m.OCA || []).map(o => `${o.N === 1 ? 'ALT' : 'ÜST'}: ${o.O}`).join(' | '));
        }
        // MTID 457 or 14: 1.5 Alt/Üst
        if (m.MTID === 457 || m.MTID === 14) {
            console.log(`   1.5 Gol (MTID ${m.MTID}):`, (m.OCA || []).map(o => `${o.N === 1 ? 'ALT' : 'ÜST'}: ${o.O}`).join(' | '));
        }
        // MTID 450 or 8: KG
        if (m.MTID === 450 || m.MTID === 8) {
            console.log(`   KG (MTID ${m.MTID}):`, (m.OCA || []).map(o => `${o.N === 1 ? 'VAR' : 'YOK'}: ${o.O}`).join(' | '));
        }
    });
});
