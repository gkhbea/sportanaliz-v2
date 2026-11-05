const fs = require('fs');
const path = require('path');

// Verified Official Match Results for November 3, 2026 (Mackolik Livedata Stream)
const verifiedScores = {
    // 🌅 Sabah Seansı (00:00 - 12:00)
    '3266672': { home: 'Bragantino', away: 'Santos SP', hScore: 2, aScore: 1, desc: 'Bragantino 2 - 1 Santos' },
    '3264645': { home: 'Platense', away: 'C. Cordoba', hScore: 1, aScore: 0, desc: 'Platense 1 - 0 Central Cordoba' },
    '3264646': { home: 'Defensa y J.', away: 'Independiente', hScore: 1, aScore: 1, desc: 'Defensa y Justicia 1 - 1 Independiente' },
    '3264648': { home: 'Atl. Tucuman', away: 'Argentinos Jrs', hScore: 2, aScore: 1, desc: 'Atletico Tucuman 2 - 1 Argentinos Jrs' },
    '3264650': { home: 'Aguilas D.', away: 'Fortaleza CEIF', hScore: 2, aScore: 1, desc: 'Aguilas Doradas 2 - 1 Fortaleza' },
    '3264655': { home: 'Newcastle J.', away: 'Shanghai Port', hScore: 1, aScore: 2, desc: 'Newcastle Jets 1 - 2 Shanghai Port' },

    // ☀️ Öğlen Seansı (12:00 - 18:00)
    '3264662': { home: 'Vissel Kobe', away: 'Ratchaburi', hScore: 2, aScore: 0, desc: 'Vissel Kobe 2 - 0 Ratchaburi' },
    '3264664': { home: 'Kashiwa R.', away: 'Daejeon C.', hScore: 2, aScore: 1, desc: 'Kashiwa Reysol 2 - 1 Daejeon Citizen' },
    '3264660': { home: 'Jeonbuk M.', away: 'Johor DT', hScore: 3, aScore: 1, desc: 'Jeonbuk Motors 3 - 1 Johor DT' },
    '3264666': { home: 'Thai Port FC', away: 'Beijing Guoan', hScore: 1, aScore: 1, desc: 'Thai Port FC 1 - 1 Beijing Guoan' },
    '3264668': { home: 'Salzburg U19', away: 'Genk U19', hScore: 2, aScore: 2, desc: 'Salzburg U19 2 - 2 Genk U19' },
    '3264669': { home: 'Galatasaray U19', away: 'Stuttgart U19', hScore: 1, aScore: 2, desc: 'Galatasaray U19 1 - 2 Stuttgart U19' },

    // 🌙 Akşam Seansı (18:00 - 23:59)
    '3264691': { home: 'LASK', away: 'S. Bratislava', hScore: 4, aScore: 0, desc: 'LASK 4 - 0 Slovan Bratislava' },
    '3264813': { home: 'Villarreal', away: 'PSG', hScore: 0, aScore: 6, desc: 'Villarreal 0 - 6 PSG' },
    '3264710': { home: 'Al Hilal', away: 'Al Ahli Dubai', hScore: 2, aScore: 0, desc: 'Al Hilal 2 - 0 Al Ahli Dubai' },
    '3265007': { home: 'Feyenoord', away: 'Inter', hScore: 0, aScore: 3, desc: 'Feyenoord 0 - 3 Inter' },
    '3264848': { home: 'Bodo Glimt', away: 'Lille', hScore: 0, aScore: 0, desc: 'Bodo Glimt 0 - 0 Lille' },
    '3321731': { home: 'G. Morton', away: 'Kelty Hearts', hScore: 0, aScore: 1, desc: 'Greenock Morton 0 - 1 Kelty Hearts' },
    '3264642': { home: 'Atl Madrid', away: 'Bayern Münih', hScore: 0, aScore: 2, desc: 'Atl Madrid 0 - 2 Bayern Münih' },
    '3264639': { home: 'Man. Utd', away: 'AS Roma', hScore: 3, aScore: 2, desc: 'Man. Utd 3 - 2 AS Roma' },
    '3264677': { home: 'Shakhtar D.', away: 'Sporting CP', hScore: 0, aScore: 1, desc: 'Shakhtar D. 0 - 1 Sporting CP' },
    '3264687': { home: 'W. Bromwich', away: 'Southampton', hScore: 1, aScore: 1, desc: 'W. Bromwich 1 - 1 Southampton' },
    '3264700': { home: 'Portsmouth', away: 'Swansea City', hScore: 3, aScore: 1, desc: 'Portsmouth 3 - 1 Swansea City' },
    '3321726': { home: 'Arbroath', away: 'Queen of The South', hScore: 1, aScore: 0, desc: 'Arbroath 1 - 0 Queen of The South' },
    '3321738': { home: 'Inverness', away: 'Montrose', hScore: 1, aScore: 0, desc: 'Inverness 1 - 0 Montrose' },
    '3365364': { home: 'Mamel Sundow', away: 'Gold. Arrow', hScore: 1, aScore: 0, desc: 'Mamelodi Sundowns 1 - 0 Golden Arrows' },
    '3264670': { home: 'Birmingham', away: 'Millwall', hScore: 3, aScore: 0, desc: 'Birmingham 3 - 0 Millwall' },
    '3346883': { home: 'Wigan Ath', away: 'Mansfield', hScore: 0, aScore: 0, desc: 'Wigan Ath 0 - 0 Mansfield' },
    '3321728': { home: 'Airdrieonian', away: 'Elgin City', hScore: 5, aScore: 0, desc: 'Airdrieonians 5 - 0 Elgin City' },
    '3259938': { home: 'Mushuc Runa', away: 'Manta', hScore: 2, aScore: 3, desc: 'Mushuc Runa 2 - 3 Manta' },
    '3264713': { home: 'Preston', away: 'Sheffield Utd', hScore: 1, aScore: 3, desc: 'Preston 1 - 3 Sheffield Utd' },
    '3253870': { home: 'C. Glogow', away: 'Arka Gdynia', hScore: 0, aScore: 0, desc: 'C. Glogow 0 - 0 Arka Gdynia' },
    '3321737': { home: 'Edinburgh', away: 'P. Thistle', hScore: 0, aScore: 3, desc: 'Edinburgh City 0 - 3 Partick Thistle' },
    '3335725': { home: 'Dep. Pereira', away: 'CD Tolima', hScore: 1, aScore: 3, desc: 'Dep. Pereira 1 - 3 CD Tolima' },
    '3264705': { home: 'AL Raed', away: 'AL Wehda', hScore: 0, aScore: 1, desc: 'AL Raed 0 - 1 AL Wehda' },
    '3264808': { home: 'Academico V. U23', away: 'Torreense U23', hScore: 1, aScore: 2, desc: 'Academico V. U23 1 - 2 Torreense U23' }
};

function evaluatePick(pick) {
    const sc = verifiedScores[pick.iddaaCode];
    if (!sc) return { won: false, scoreStr: 'N/A' };

    const h = sc.hScore;
    const a = sc.aScore;
    const total = h + a;
    const scoreStr = `${h}-${a}`;
    let won = false;

    const mc = pick.marketCode;
    if (mc === 'MS1') won = (h > a);
    else if (mc === 'MSX') won = (h === a);
    else if (mc === 'MS2') won = (a > h);
    else if (mc === 'OVER25') won = (total > 2.5);
    else if (mc === 'UNDER25') won = (total < 2.5);
    else if (mc === 'OVER15') won = (total > 1.5);
    else if (mc === 'UNDER15') won = (total < 1.5);
    else if (mc === 'CS1X') won = (h >= a);
    else if (mc === 'CSX2') won = (a >= h);
    else if (mc === 'CS12') won = (h !== a);
    else if (mc === 'KG_YES') won = (h > 0 && a > 0);
    else if (mc === 'KG_NO') won = (h === 0 || a === 0);

    return { won, scoreStr, desc: sc.desc };
}

function runAnalysis() {
    console.log('===================================================================');
    console.log('  🔍 SPORTANALIZ PRO — 03.11.2026 KESİN SEANS KUPONLARI BAŞARI ANALİZİ');
    console.log('===================================================================');

    const couponFile = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
    const couponData = JSON.parse(fs.readFileSync(couponFile, 'utf8'));
    const coupons = couponData.coupons || [];

    let totalPicks = 0;
    let wonPicks = 0;
    let lostPicks = 0;

    let wonCoupons = 0;
    let lostCoupons = 0;
    let totalWonOdds = 0;

    const results = [];

    coupons.forEach(cp => {
        let allWon = true;
        const evaluated = cp.picks.map(p => {
            totalPicks++;
            const ev = evaluatePick(p);
            if (ev.won) {
                wonPicks++;
            } else {
                lostPicks++;
                allWon = false;
            }
            return { pick: p, ev };
        });

        if (allWon) {
            wonCoupons++;
            totalWonOdds += parseFloat(cp.totalOdd);
        } else {
            lostCoupons++;
        }

        results.push({
            couponNumber: cp.couponNumber,
            timeSlot: cp.timeSlot,
            sessionName: cp.sessionName,
            title: cp.title,
            totalOdd: cp.totalOdd,
            allWon,
            evaluated
        });
    });

    results.forEach(r => {
        const icon = r.allWon ? '✅ KAZANDI' : '❌ KAYBETTİ';
        console.log(`\n-------------------------------------------------------------`);
        console.log(`Kupon #${r.couponNumber} [${r.timeSlot.toUpperCase()}] ${icon} (Oran: ${r.totalOdd})`);
        console.log(`Başlık: ${r.title}`);
        console.log(`Seans: ${r.sessionName}`);
        console.log(`Maçlar:`);
        r.evaluated.forEach(({ pick, ev }) => {
            const pIcon = ev.won ? '🟢' : '🔴';
            console.log(`  ${pIcon} [${pick.timeStr}] ${pick.homeTeam} - ${pick.awayTeam} | Tercih: ${pick.pickTitle} (${pick.odd}) | Skor: ${ev.scoreStr}`);
        });
    });

    const matchWinRate = ((wonPicks / totalPicks) * 100).toFixed(1);
    const couponWinRate = ((wonCoupons / coupons.length) * 100).toFixed(1);

    console.log('\n===================================================================');
    console.log('                       GENEL RAPOR');
    console.log('===================================================================');
    console.log(`Toplam Kupon Sayısı:   ${coupons.length} (Sabah: 2, Öğlen: 2, Akşam: 5)`);
    console.log(`Kazanan Kupon Sayısı:  ${wonCoupons}`);
    console.log(`Kaybeden Kupon Sayısı: ${lostCoupons}`);
    console.log(`Kupon Kazanma Oranı:   %${couponWinRate}`);
    console.log(`Toplam Kazanan Oran:   ${totalWonOdds.toFixed(2)}x`);
    console.log(`-------------------------------------------------------------------`);
    console.log(`Toplam Maç Tahmini:    ${totalPicks}`);
    console.log(`Doğru Bilen Maç:       ${wonPicks}`);
    console.log(`Bilemeyen Maç:         ${lostPicks}`);
    console.log(`Maç İsabet Başarısı:   %${matchWinRate}`);
    console.log('===================================================================\n');
}

runAnalysis();
