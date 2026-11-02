const fs = require('fs');
const path = require('path');

const bulten = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data_cache', 'nesine_bulten_today.json'), 'utf8'));
const events = bulten.sg.EA || [];
const leagues = bulten.sg.LA || [];
const leagueMap = new Map();
leagues.forEach(l => leagueMap.set(l.LID, l));

const nov3 = events.filter(e => e.D === '03.11.2026' && e.GT === 1 && e.TYPE === 1);
console.log('Total real football matches on 03.11.2026:', nov3.length);

const parsed = [];
nov3.forEach(e => {
    const l = leagueMap.get(e.LC) || { N: '', CC: '' };
    
    let ms1 = null, msX = null, ms2 = null;
    let cs1X = null, csX2 = null;
    let o25 = null, u25 = null, o15 = null, u15 = null;
    let kgVar = null, kgYok = null;

    (e.MA || []).forEach(m => {
        if (m.MTID === 1) {
            (m.OCA || []).forEach(o => {
                if (o.N === 1) ms1 = o.O;
                if (o.N === 2) msX = o.O;
                if (o.N === 3) ms2 = o.O;
            });
        }
        if (m.MTID === 3) {
            (m.OCA || []).forEach(o => {
                if (o.N === 1) cs1X = o.O;
                if (o.N === 3) csX2 = o.O;
            });
        }
        if (m.MTID === 455 || m.MTID === 12) {
            (m.OCA || []).forEach(o => {
                if (o.N === 1) u25 = o.O;
                if (o.N === 2) o25 = o.O;
            });
        }
        if (m.MTID === 457 || m.MTID === 14) {
            (m.OCA || []).forEach(o => {
                if (o.N === 1) u15 = o.O;
                if (o.N === 2) o15 = o.O;
            });
        }
        if (m.MTID === 450 || m.MTID === 8) {
            (m.OCA || []).forEach(o => {
                if (o.N === 1) kgVar = o.O;
                if (o.N === 2) kgYok = o.O;
            });
        }
    });

    parsed.push({
        code: e.C,
        time: e.T,
        home: e.HN,
        away: e.AN,
        league: l.N,
        country: l.CC,
        mbs: e.EMBS || e.MBS || 1,
        odds: { ms1, msX, ms2, cs1X, csX2, o15, o25, u25, kgVar, kgYok }
    });
});

parsed.sort((a, b) => a.time.localeCompare(b.time));

console.log('Sample parsed matches:');
parsed.forEach(m => {
    console.log(`[${m.code}] ${m.time} | ${m.league} (${m.country}) | ${m.home} vs ${m.away} | MBS: ${m.mbs} | MS1: ${m.odds.ms1} X: ${m.odds.msX} MS2: ${m.odds.ms2} | 2.5Ü: ${m.odds.o25} | KG-Var: ${m.odds.kgVar}`);
});
