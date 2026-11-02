const fs = require('fs');
const path = require('path');

// 25 Elite Matches
const matches = {
    // 1. UEFA Champions League
    bayern: {
        iddaaCode: '3264642', homeTeam: 'Atl Madrid', awayTeam: 'Bayern Münih', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.28' },
        opt2: { marketTitle: 'Karşılıklı Gol', pickTitle: 'KG VAR', marketCode: 'KG_YES', odd: '1.25' }
    },
    manutd: {
        iddaaCode: '3264639', homeTeam: 'Man. Utd', awayTeam: 'AS Roma', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.33' },
        opt2: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Man Utd Kazanır)', marketCode: 'MS1', odd: '2.09' }
    },
    psg: {
        iddaaCode: '3264813', homeTeam: 'Villarreal', awayTeam: 'PSG', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (PSG Kazanır)', marketCode: 'MS2', odd: '1.40' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.20' }
    },
    inter: {
        iddaaCode: '3265007', homeTeam: 'Feyenoord', awayTeam: 'Inter', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Inter Kazanır)', marketCode: 'MS2', odd: '1.61' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.26' }
    },
    lille: {
        iddaaCode: '3264848', homeTeam: 'Bodo Glimt', awayTeam: 'Lille', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Bodo Glimt Kazanır)', marketCode: 'MS1', odd: '1.64' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.32' }
    },
    sporting: {
        iddaaCode: '3264677', homeTeam: 'Shakhtar D.', awayTeam: 'Sporting CP', league: 'UEFA Şampiyonlar Ligi', timeStr: '20:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Sporting CP Kazanır)', marketCode: 'MS2', odd: '1.77' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.49' }
    },
    lask: {
        iddaaCode: '3264691', homeTeam: 'LASK', awayTeam: 'S. Bratislava', league: 'UEFA Şampiyonlar Ligi', timeStr: '23:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (LASK Kazanır)', marketCode: 'MS1', odd: '1.24' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ALT', marketCode: 'UNDER25', odd: '1.25' }
    },

    // 2. İngiltere Championship
    birmingham: {
        iddaaCode: '3264670', homeTeam: 'Birmingham', awayTeam: 'Millwall', league: 'İngiltere Championship', timeStr: '23:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Birmingham Kazanır)', marketCode: 'MS1', odd: '1.75' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.59' }
    },
    southampton: {
        iddaaCode: '3264687', homeTeam: 'W. Bromwich', awayTeam: 'Southampton', league: 'İngiltere Championship', timeStr: '23:00',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.28' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.49' }
    },
    swansea: {
        iddaaCode: '3264700', homeTeam: 'Portsmouth', awayTeam: 'Swansea City', league: 'İngiltere Championship', timeStr: '22:45',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.34' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.54' }
    },
    sheffield: {
        iddaaCode: '3264713', homeTeam: 'Preston', awayTeam: 'Sheffield Utd', league: 'İngiltere Championship', timeStr: '22:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Sheffield Utd Kazanır)', marketCode: 'MS2', odd: '2.07' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.65' }
    },

    // 3. Asya Şampiyonlar Ligi Elite
    alhilal: {
        iddaaCode: '3264710', homeTeam: 'Al Hilal', awayTeam: 'Al Ahli Dubai', league: 'Asya Şampiyonlar Ligi Elite', timeStr: '21:15',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Al Hilal Kazanır)', marketCode: 'MS1', odd: '1.31' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.26' }
    },
    jeonbuk: {
        iddaaCode: '3264660', homeTeam: 'Jeonbuk', awayTeam: 'Johor Darul', league: 'Asya Şampiyonlar Ligi Elite', timeStr: '13:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Johor Darul Kazanır)', marketCode: 'MS2', odd: '1.98' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.52' }
    },

    // 4. Brezilya Serie A & Güney Amerika
    bragantino: {
        iddaaCode: '3266672', homeTeam: 'Bragantino', awayTeam: 'Santos SP', league: 'Brezilya Serie A', timeStr: '02:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Bragantino Kazanır)', marketCode: 'MS1', odd: '1.79' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.39' }
    },
    goias: {
        iddaaCode: '3253324', homeTeam: 'Goias GO', awayTeam: 'Crb Al', league: 'Brezilya Serie B', timeStr: '02:30',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.21' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.49' }
    },
    defjusticia: {
        iddaaCode: '3258448', homeTeam: 'Def. Justicia', awayTeam: 'Independiente', league: 'Arjantin Primera LPF', timeStr: '01:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Def. Justicia Kazanır)', marketCode: 'MS1', odd: '1.96' },
        opt2: { marketTitle: 'Çifte Şans', pickTitle: 'X-2 Çifte Şans', marketCode: 'CSX2', odd: '1.47' }
    },
    tucuman: {
        iddaaCode: '3258962', homeTeam: 'Atl Tucuman', awayTeam: 'Argentinos J.', league: 'Arjantin Primera LPF', timeStr: '03:15',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.31' },
        opt2: { marketTitle: 'Çifte Şans', pickTitle: 'X-2 Çifte Şans', marketCode: 'CSX2', odd: '1.25' }
    },
    concepcion: {
        iddaaCode: '3259015', homeTeam: 'Dep. Concepcion', awayTeam: 'Palestino', league: 'Şili Premier Ligi', timeStr: '02:30',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.24' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.62' }
    },
    bucaramanga: {
        iddaaCode: '3259164', homeTeam: 'CA Bucaramanga', awayTeam: 'Atl. Nacional Medellin', league: 'Kolombiya Primera A', timeStr: '04:15',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Atl. Nacional Kazanır)', marketCode: 'MS2', odd: '1.92' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.67' }
    },

    // 5. İskoçya Kupa & Avrupa Kupaları
    airdrie: {
        iddaaCode: '3321728', homeTeam: 'Airdrieonian', awayTeam: 'Elgin City', league: 'İskoçya Challenge Cup', timeStr: '22:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Airdrieonian Kazanır)', marketCode: 'MS1', odd: '1.54' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.35' }
    },
    morton: {
        iddaaCode: '3321731', homeTeam: 'G. Morton', awayTeam: 'Kelty Hearts', league: 'İskoçya Challenge Cup', timeStr: '22:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (G. Morton Kazanır)', marketCode: 'MS1', odd: '1.28' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.26' }
    },
    inverness: {
        iddaaCode: '3321738', homeTeam: 'Inverness', awayTeam: 'Montrose', league: 'İskoçya Challenge Cup', timeStr: '22:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Inverness Kazanır)', marketCode: 'MS1', odd: '1.26' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.27' }
    },
    wigan: {
        iddaaCode: '3346883', homeTeam: 'Wigan Ath', awayTeam: 'Mansfield', league: 'İngiltere Football League Trophy', timeStr: '22:45',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Mansfield Kazanır)', marketCode: 'MS2', odd: '1.82' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.52' }
    },
    glogow: {
        iddaaCode: '3253870', homeTeam: 'C. Glogow', awayTeam: 'Arka Gdynia', league: 'Polonya 1. Lig', timeStr: '20:00',
        opt1: { marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans', marketCode: 'CS1X', odd: '1.28' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.62' }
    },
    mamelodi: {
        iddaaCode: '3365364', homeTeam: 'Mamel Sundow', awayTeam: 'Gold. Arrow', league: 'Güney Afrika Premier Ligi', timeStr: '20:00',
        opt1: { marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Mamelodi Kazanır)', marketCode: 'MS1', odd: '1.21' },
        opt2: { marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.74' }
    }
};

function createPick(mObj, optKey) {
    const opt = mObj[optKey];
    return {
        iddaaCode: mObj.iddaaCode,
        homeTeam: mObj.homeTeam,
        awayTeam: mObj.awayTeam,
        league: mObj.league,
        timeStr: mObj.timeStr,
        marketTitle: opt.marketTitle,
        pickTitle: opt.pickTitle,
        marketCode: opt.marketCode,
        odd: opt.odd,
        matchText: `${mObj.timeStr} ${mObj.homeTeam} - ${mObj.awayTeam} ${opt.pickTitle} ${opt.odd}`
    };
}

// 15 Coupons Composition (5 Morning, 5 Noon, 5 Evening)
// Each match used AT MOST TWICE with distinct options!
const couponDefs = [
    // --- 🌅 SABAH SEANSI (Kupon 1-5) ---
    {
        couponNumber: 1, title: "🛡️ Sabah Garantör Banko / Kasa Katlama Kuponu",
        timeSlot: "morning", sessionName: "Sabah Kuponu", themeColor: '#10B981', icon: '🛡️', badge: "🛡️ Kasa Katlama",
        picks: [
            createPick(matches.lask, 'opt1'),        // LASK MS1 (1.24)
            createPick(matches.psg, 'opt1'),         // PSG MS2 (1.40)
            createPick(matches.alhilal, 'opt1')      // Al Hilal MS1 (1.31)
        ]
    },
    {
        couponNumber: 2, title: "⚡ Sabah İdeal Sistem Kuponu (Editör Seçimi)",
        timeSlot: "morning", sessionName: "Sabah Kuponu", themeColor: '#3B82F6', icon: '⚡', badge: "⚡ Editör Seçimi",
        picks: [
            createPick(matches.inter, 'opt1'),       // Inter MS2 (1.61)
            createPick(matches.lille, 'opt1'),       // Bodo Glimt MS1 (1.64)
            createPick(matches.morton, 'opt1')       // G. Morton MS1 (1.28)
        ]
    },
    {
        couponNumber: 3, title: "⚽ Sabah Gol Yağmuru (Devler Ligi 2.5 ÜST)",
        timeSlot: "morning", sessionName: "Sabah Kuponu", themeColor: '#EC4899', icon: '⚽', badge: "⚽ Gol Yağmuru",
        picks: [
            createPick(matches.bayern, 'opt1'),      // Atl Madrid vs Bayern 2.5 ÜST (1.28)
            createPick(matches.manutd, 'opt1'),      // Man Utd vs Roma 2.5 ÜST (1.33)
            createPick(matches.sporting, 'opt2')     // Shakhtar vs Sporting 2.5 ÜST (1.49)
        ]
    },
    {
        couponNumber: 4, title: "🎯 Sabah Sıfır Risk Sigortalı Çifte Şans",
        timeSlot: "morning", sessionName: "Sabah Kuponu", themeColor: '#10B981', icon: '🎯', badge: "🎯 Çifte Şans",
        picks: [
            createPick(matches.southampton, 'opt1'), // W. Bromwich 1-X (1.28)
            createPick(matches.swansea, 'opt1'),     // Portsmouth 1-X (1.34)
            createPick(matches.goias, 'opt1')        // Goias 1-X (1.21)
        ]
    },
    {
        couponNumber: 5, title: "💎 Sabah Akılcı Değer & Taraf Kuponu",
        timeSlot: "morning", sessionName: "Sabah Kuponu", themeColor: '#8B5CF6', icon: '💎', badge: "💎 Akılcı Değer",
        picks: [
            createPick(matches.manutd, 'opt2'),      // Man Utd MS1 (2.09)
            createPick(matches.sporting, 'opt1'),    // Sporting CP MS2 (1.77)
            createPick(matches.inverness, 'opt1')    // Inverness MS1 (1.26)
        ]
    },

    // --- ☀️ ÖĞLEN SEANSI (Kupon 6-10) ---
    {
        couponNumber: 6, title: "🌟 Öğlen VIP Kombin (Devler Ligi Süper Güçleri)",
        timeSlot: "noon", sessionName: "Öğlen Kuponu", themeColor: '#6366F1', icon: '🌟', badge: "🌟 VIP Kombin",
        picks: [
            createPick(matches.psg, 'opt2'),         // Villarreal vs PSG 2.5 ÜST (1.20)
            createPick(matches.inter, 'opt2'),       // Feyenoord vs Inter 2.5 ÜST (1.26)
            createPick(matches.alhilal, 'opt2')      // Al Hilal vs Al Ahli 2.5 ÜST (1.26)
        ]
    },
    {
        couponNumber: 7, title: "🛡️ Öğlen Garanti & Kasa Katlama Kuponu",
        timeSlot: "noon", sessionName: "Öğlen Kuponu", themeColor: '#10B981', icon: '🛡️', badge: "🛡️ Kasa Katlama",
        picks: [
            createPick(matches.mamelodi, 'opt1'),    // Mamelodi Sundowns MS1 (1.21)
            createPick(matches.lask, 'opt2'),        // LASK 2.5 ALT (1.25)
            createPick(matches.inverness, 'opt2')    // Inverness 2.5 ÜST (1.27)
        ]
    },
    {
        couponNumber: 8, title: "⚽ Öğlen Gol Düellosu (Tempolu 2.5 ÜST)",
        timeSlot: "noon", sessionName: "Öğlen Kuponu", themeColor: '#EC4899', icon: '⚽', badge: "⚽ Gol Düellosu",
        picks: [
            createPick(matches.birmingham, 'opt2'),  // Birmingham 2.5 ÜST (1.59)
            createPick(matches.southampton, 'opt2'), // W. Bromwich 2.5 ÜST (1.49)
            createPick(matches.lille, 'opt2')        // Bodo Glimt vs Lille 2.5 ÜST (1.32)
        ]
    },
    {
        couponNumber: 9, title: "🔥 Öğlen Derbi Ateşi & Karşılıklı Gol",
        timeSlot: "noon", sessionName: "Öğlen Kuponu", themeColor: '#F97316', icon: '🔥', badge: "🔥 Derbi Ateşi",
        picks: [
            createPick(matches.bayern, 'opt2'),      // Atl Madrid vs Bayern KG VAR (1.25)
            createPick(matches.wigan, 'opt2'),       // Wigan vs Mansfield 2.5 ÜST (1.52)
            createPick(matches.airdrie, 'opt2')      // Airdrieonian 2.5 ÜST (1.35)
        ]
    },
    {
        couponNumber: 10, title: "🎯 Öğlen Taraf Güvencesi & Editörün Yıldızı",
        timeSlot: "noon", sessionName: "Öğlen Kuponu", themeColor: '#8B5CF6', icon: '🎯', badge: "🎯 Taraf Güvencesi",
        picks: [
            createPick(matches.birmingham, 'opt1'),  // Birmingham MS1 (1.75)
            createPick(matches.airdrie, 'opt1'),     // Airdrieonian MS1 (1.54)
            createPick(matches.morton, 'opt2')       // Morton 2.5 ÜST (1.26)
        ]
    },

    // --- 🌙 AKŞAM SEANSI (Kupon 11-15) ---
    {
        couponNumber: 11, title: "🌙 Akşam Şampiyonlar Ligi & Brezilya Kasa Katlama",
        timeSlot: "evening", sessionName: "Akşam Kuponu", themeColor: '#F59E0B', icon: '🌙', badge: "🌙 Kasa Katlama",
        picks: [
            createPick(matches.bragantino, 'opt1'),  // Bragantino MS1 (1.79)
            createPick(matches.sheffield, 'opt1'),   // Sheffield Utd MS2 (2.07)
            createPick(matches.glogow, 'opt1')       // C. Glogow 1-X (1.28)
        ]
    },
    {
        couponNumber: 12, title: "🛡️ Akşam Sıfır Risk Sigortalı Kombin",
        timeSlot: "evening", sessionName: "Akşam Kuponu", themeColor: '#10B981', icon: '🛡️', badge: "🛡️ Sıfır Risk",
        picks: [
            createPick(matches.tucuman, 'opt1'),     // Tucuman 1-X (1.31)
            createPick(matches.concepcion, 'opt1'),  // Concepcion 1-X (1.24)
            createPick(matches.defjusticia, 'opt2')  // Def. Justicia X-2 (1.47)
        ]
    },
    {
        couponNumber: 13, title: "⚽ Akşam Gol Yağmuru (Devler Ligi & Samba Şöleni)",
        timeSlot: "evening", sessionName: "Akşam Kuponu", themeColor: '#EC4899', icon: '⚽', badge: "⚽ Gol Yağmuru",
        picks: [
            createPick(matches.bragantino, 'opt2'),  // Bragantino 2.5 ÜST (1.39)
            createPick(matches.goias, 'opt2'),       // Goias 2.5 ÜST (1.49)
            createPick(matches.sheffield, 'opt2')    // Preston vs Sheffield 2.5 ÜST (1.65)
        ]
    },
    {
        couponNumber: 14, title: "💎 Akşam Yüksek Değer Kombini (Süper Oran)",
        timeSlot: "evening", sessionName: "Akşam Kuponu", themeColor: '#8B5CF6', icon: '💎', badge: "💎 Yüksek Değer",
        picks: [
            createPick(matches.defjusticia, 'opt1'), // Def. Justicia MS1 (1.96)
            createPick(matches.bucaramanga, 'opt1'), // Atl. Nacional MS2 (1.92)
            createPick(matches.wigan, 'opt1')        // Mansfield MS2 (1.82)
        ]
    },
    {
        couponNumber: 15, title: "🌟 Akşam Kapanış Süper Kombini",
        timeSlot: "evening", sessionName: "Akşam Kuponu", themeColor: '#F59E0B', icon: '🌟', badge: "🌟 Kapanış Kombini",
        picks: [
            createPick(matches.bucaramanga, 'opt2'), // Bucaramanga 2.5 ÜST (1.67)
            createPick(matches.concepcion, 'opt2'),  // Concepcion 2.5 ÜST (1.62)
            createPick(matches.glogow, 'opt2')       // Glogow 2.5 ÜST (1.62)
        ]
    }
];

// Calculate odds, set subtitles and structure
const formattedCoupons = couponDefs.map(c => {
    const totalOdd = c.picks.reduce((acc, p) => acc * parseFloat(p.odd), 1);
    const subtitle = c.picks.map(p => `${p.homeTeam} (${p.odd})`).join(', ');
    return {
        couponNumber: c.couponNumber,
        name: `03.11.2026 - ${c.couponNumber}`,
        title: c.title,
        subtitle: subtitle,
        badge: c.badge,
        totalOdd: Math.round(totalOdd * 100) / 100,
        picks: c.picks,
        savedInAccount: false,
        screenshot: path.join(__dirname, '..', 'data_cache', 'screenshots', `nesine_kupon_${c.couponNumber}.png`),
        timestamp: new Date().toISOString(),
        timeSlot: c.timeSlot,
        sessionName: c.sessionName,
        sessionTimeRange: c.timeSlot === 'morning' ? '10:00 - 13:00' : c.timeSlot === 'noon' ? '13:00 - 18:00' : '18:00 - 23:59'
    };
});

const outObj = {
    date: '03.11.2026',
    userAccount: '14410079556',
    generatedAt: new Date().toISOString(),
    totalCoupons: formattedCoupons.length,
    sessions: {
        morning: formattedCoupons.filter(c => c.timeSlot === 'morning').length,
        noon: formattedCoupons.filter(c => c.timeSlot === 'noon').length,
        evening: formattedCoupons.filter(c => c.timeSlot === 'evening').length
    },
    description: "03.11.2026 UEFA Şampiyonlar Ligi ve Seçkin Liglerden 15 Kaliteli Kupon (5 Sabah, 5 Öğlen, 5 Akşam) - Max 2 Tekrar & Farklı Seçenek Garantili",
    coupons: formattedCoupons
};

const outPath = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
fs.writeFileSync(outPath, JSON.stringify(outObj, null, 2), 'utf8');
console.log(`✅ [BAŞARILI] 15 adet seçkin lig kuponu kaydedildi: ${outPath}`);
