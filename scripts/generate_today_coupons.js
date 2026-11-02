/**
 * generate_today_coupons.js — SportAnaliz Pro
 * Kaliteli ve Seçkin Liglerden Günün 15 Kuponunu Oluşturur
 * 
 * Seans Dağılımı:
 * - 5 Sabah Kuponu (Kupon 1-5): Elit Ligler Banko & Kasa Katlama
 * - 5 Öğlen Kuponu (Kupon 6-10): Avrupa & Asya Devleri, Vitrin ve Gol Kombinleri
 * - 5 Akşam Kuponu (Kupon 11-15): Gece Sambası, Gol Düelloları ve Kapanış
 * 
 * KULLANICI KURALLARI (KESİN VE TAVİZSİZ):
 * 1. Bir maç tüm kuponlar genelinde EN FAZLA 2 KERE oynanabilir.
 * 2. Bir maç 2 kere oynanıyorsa, KESİNLİKLE FARKLI BİR BAHİS SEÇENEĞİ (seçenek/market) ile oynanmak zorundadır!
 * 3. Oranlar 1.20'nin altında olamaz.
 * 4. Tüm maçlar güncel Nesine bülteninden ve %100 MBS uyumludur.
 */

const fs = require('fs');
const path = require('path');

const couponConfigs = [
    // -------------------------------------------------------------
    // SEANS 1: SABAH KUPONLARI (1 - 5) — ELİT LİGLER BANKO & KASA KATLAMA
    // -------------------------------------------------------------
    {
        couponNumber: 1,
        title: "🛡️ Sabah Garantör Banko / Kasa Katlama Kuponu",
        subtitle: "Kayserispor (1.25), CSD Liniers (1.33) ve Dinamo Kiev (1.21)",
        timeSlot: "morning",
        sessionName: "Sabah Kuponu",
        sessionTimeRange: "10:00 - 13:00",
        badge: "🛡️ Kasa Katlama",
        themeColor: '#10B981',
        icon: '🛡️',
        picks: [
            { iddaaCode: '3262028', homeTeam: 'Kayserispor', awayTeam: 'Muğlaspor', league: 'Türkiye 1. Lig', timeStr: '20:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Kayserispor Kazanır)', marketCode: 'MS1', odd: '1.25' },
            { iddaaCode: '3253579', homeTeam: 'CSD Liniers', awayTeam: 'Ituzaingo', league: 'Arjantin Primera B', timeStr: '21:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (CSD Liniers Kazanır)', marketCode: 'MS1', odd: '1.33' },
            { iddaaCode: '3253921', homeTeam: 'Kryvbas K. R.', awayTeam: 'Dinamo Kiev', league: 'Ukrayna Premier Ligi', timeStr: '14:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Dinamo Kiev Kazanır)', marketCode: 'MS2', odd: '1.21' }
        ]
    },
    {
        couponNumber: 2,
        title: "⚡ Sabah İdeal Sistem Kuponu (Editör Seçimi)",
        subtitle: "Reims (1.54), Sumgayit (1.55) ve Atromitos (1.62)",
        timeSlot: "morning",
        sessionName: "Sabah Kuponu",
        sessionTimeRange: "10:00 - 13:00",
        badge: "⚡ Editör Seçimi",
        themeColor: '#3B82F6',
        icon: '⚡',
        picks: [
            { iddaaCode: '3354433', homeTeam: 'Reims', awayTeam: 'Sochaux', league: 'Fransa Ligue 2', timeStr: '22:45', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Reims Kazanır)', marketCode: 'MS1', odd: '1.54' },
            { iddaaCode: '3252565', homeTeam: 'Sumgayit', awayTeam: 'Safa', league: 'Azerbaycan Premier Lig', timeStr: '18:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Sumgayit Kazanır)', marketCode: 'MS1', odd: '1.55' },
            { iddaaCode: '3253703', homeTeam: 'Atromitos', awayTeam: 'Volos', league: 'Yunanistan Süper Lig', timeStr: '19:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Atromitos Kazanır)', marketCode: 'MS1', odd: '1.62' }
        ]
    },
    {
        couponNumber: 3,
        title: "⚽ Sabah Gol Yağmuru Kuponu (1.5 / 2.5 ÜST)",
        subtitle: "Benfica 2.5 ÜST (1.21), Al Wasl 2.5 ÜST (1.27) ve AL Gharrafa 2.5 ÜST (1.22)",
        timeSlot: "morning",
        sessionName: "Sabah Kuponu",
        sessionTimeRange: "10:00 - 13:00",
        badge: "⚽ Gol Yağmuru",
        themeColor: '#EC4899',
        icon: '⚽',
        picks: [
            { iddaaCode: '3262056', homeTeam: 'Benfica', awayTeam: 'Alverca', league: 'Portekiz Premier Lig', timeStr: '23:15', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.21' },
            { iddaaCode: '3262378', homeTeam: 'Al Wasl', awayTeam: 'AL Jawiya', league: 'AFC Asya Şampiyonlar Ligi', timeStr: '19:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.27' },
            { iddaaCode: '3262348', homeTeam: 'AL Gharrafa', awayTeam: 'AL Qadisiyah', league: 'AFC Asya Şampiyonlar Ligi', timeStr: '21:15', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.22' }
        ]
    },
    {
        couponNumber: 4,
        title: "🎯 Sabah Çifte Şans & Sıfır Risk Sigortalı Kupon",
        subtitle: "Lorient 1-X (1.25), Gençlerbirliği 1-X (1.32) ve Real Oviedo (1.54)",
        timeSlot: "morning",
        sessionName: "Sabah Kuponu",
        sessionTimeRange: "10:00 - 13:00",
        badge: "🎯 Sıfır Risk",
        themeColor: '#10B981',
        icon: '🎯',
        picks: [
            { iddaaCode: '3254536', homeTeam: 'Lorient', awayTeam: 'Brest', league: 'Fransa Ligue 1', timeStr: '22:45', marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans (Lorient Kaybetmez)', marketCode: 'CS1X', odd: '1.25' },
            { iddaaCode: '3262290', homeTeam: 'Gençlerbirliği', awayTeam: 'Alanyaspor', league: 'Türkiye Süper Ligi', timeStr: '20:00', marketTitle: 'Çifte Şans', pickTitle: '1-X Çifte Şans (Gençlerbirliği Kaybetmez)', marketCode: 'CS1X', odd: '1.32' },
            { iddaaCode: '3258465', homeTeam: 'Real Oviedo', awayTeam: 'Las Palmas', league: 'İspanya 2. Lig', timeStr: '18:15', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Real Oviedo Kazanır)', marketCode: 'MS1', odd: '1.54' }
        ]
    },
    {
        couponNumber: 5,
        title: "💎 Sabah Akılcı Değer & Taraf Kuponu",
        subtitle: "Polonia Bytom (1.76), Zorya Luhansk (1.77) ve Landskrona (1.49)",
        timeSlot: "morning",
        sessionName: "Sabah Kuponu",
        sessionTimeRange: "10:00 - 13:00",
        badge: "💎 Değer Kombini",
        themeColor: '#8B5CF6',
        icon: '💎',
        picks: [
            { iddaaCode: '3255447', homeTeam: 'Polonia Bytom', awayTeam: 'Odra Opole', league: 'Polonya 1. Lig', timeStr: '20:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Polonia Bytom Kazanır)', marketCode: 'MS1', odd: '1.76' },
            { iddaaCode: '3254538', homeTeam: 'Zorya Luhansk', awayTeam: 'Epicentr Dunaivtsi', league: 'Ukrayna Premier Ligi', timeStr: '14:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Zorya Luhansk Kazanır)', marketCode: 'MS1', odd: '1.77' },
            { iddaaCode: '3262362', homeTeam: 'Landskrona', awayTeam: 'Orebro SK', league: 'İsveç Superettan', timeStr: '21:05', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Landskrona Kazanır)', marketCode: 'MS1', odd: '1.49' }
        ]
    },

    // -------------------------------------------------------------
    // SEANS 2: ÖĞLEN KUPONLARI (6 - 10) — AVRUPA & ASYA DEVLERİ & DERBİLER
    // -------------------------------------------------------------
    {
        couponNumber: 6,
        title: "🌟 Öğlen VIP Kombin (Avrupa & Asya)",
        subtitle: "Jong PSV MS 2 (1.36), Al Sadd 2.5 ÜST (1.25) ve El Ahly MS 1 (1.21)",
        timeSlot: "noon",
        sessionName: "Öğlen Kuponu",
        sessionTimeRange: "14:00 - 17:30",
        badge: "🌟 VIP Seçim",
        themeColor: '#6366F1',
        icon: '🌟',
        picks: [
            { iddaaCode: '3262151', homeTeam: 'Jong PSV', awayTeam: 'NAC Breda', league: 'Hollanda 1. Lig', timeStr: '22:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (NAC Breda Kazanır)', marketCode: 'MS2', odd: '1.36' },
            { iddaaCode: '3262027', homeTeam: 'Al Sadd', awayTeam: 'Al Ahli Saudi', league: 'AFC Asya Şampiyonlar Ligi', timeStr: '19:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.25' },
            { iddaaCode: '3342565', homeTeam: 'El Ahly (Mıs)', awayTeam: 'Al Mokawloon', league: 'Mısır Lig Kupası', timeStr: '21:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (El Ahly Kazanır)', marketCode: 'MS1', odd: '1.21' }
        ]
    },
    {
        couponNumber: 7,
        title: "🛡️ Öğlen Garanti & Kasa Katlama Kuponu",
        subtitle: "Kayserispor 2.5 ÜST (1.44), Radomiak Radom 2.5 ÜST (1.35) ve Chelmsford 2.5 ÜST (1.30)",
        timeSlot: "noon",
        sessionName: "Öğlen Kuponu",
        sessionTimeRange: "14:00 - 17:30",
        badge: "🛡️ Garanti Banko",
        themeColor: '#10B981',
        icon: '🛡️',
        picks: [
            { iddaaCode: '3262028', homeTeam: 'Kayserispor', awayTeam: 'Muğlaspor', league: 'Türkiye 1. Lig', timeStr: '20:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.44' },
            { iddaaCode: '3253955', homeTeam: 'Radomiak Radom', awayTeam: 'Slask Wroclaw', league: 'Polonya Ekstraklasa', timeStr: '20:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.35' },
            { iddaaCode: '3317978', homeTeam: 'Chelmsford C.', awayTeam: 'Farnham Town', league: 'İngiltere Ulusal Lig', timeStr: '22:45', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.30' }
        ]
    },
    {
        couponNumber: 8,
        title: "⚽ Öğlen Gol Düellosu (2.5 ÜST Kombini)",
        subtitle: "Reims 2.5 ÜST (1.60), Rakow 2.5 ÜST (1.35) ve U. Cluj vs FCSB 2.5 ÜST (1.40)",
        timeSlot: "noon",
        sessionName: "Öğlen Kuponu",
        sessionTimeRange: "14:00 - 17:30",
        badge: "⚽ Gol Düellosu",
        themeColor: '#EC4899',
        icon: '⚽',
        picks: [
            { iddaaCode: '3354433', homeTeam: 'Reims', awayTeam: 'Sochaux', league: 'Fransa Ligue 2', timeStr: '22:45', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.60' },
            { iddaaCode: '3255468', homeTeam: 'Rakow C.', awayTeam: 'Pogon Szczecin', league: 'Polonya Ekstraklasa', timeStr: '22:30', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.35' },
            { iddaaCode: '3255270', homeTeam: 'U. Cluj', awayTeam: 'FCSB', league: 'Romanya 1. Lig', timeStr: '21:30', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.40' }
        ]
    },
    {
        couponNumber: 9,
        title: "🔥 Öğlen Karşılıklı Gol & Tempolu Maçlar",
        subtitle: "Jong PSV vs NAC Breda KG VAR (1.45), Jong Ajax vs Vitesse KG VAR (1.45) ve Lorient 2.5 ÜST (1.88)",
        timeSlot: "noon",
        sessionName: "Öğlen Kuponu",
        sessionTimeRange: "14:00 - 17:30",
        badge: "🔥 Tempolu Maçlar",
        themeColor: '#F97316',
        icon: '🔥',
        picks: [
            { iddaaCode: '3262151', homeTeam: 'Jong PSV', awayTeam: 'NAC Breda', league: 'Hollanda 1. Lig', timeStr: '22:00', marketTitle: 'Karşılıklı Gol', pickTitle: 'KG VAR', marketCode: 'KG_YES', odd: '1.45' },
            { iddaaCode: '3262341', homeTeam: 'Jong Ajax', awayTeam: 'Vitesse', league: 'Hollanda 1. Lig', timeStr: '22:00', marketTitle: 'Karşılıklı Gol', pickTitle: 'KG VAR', marketCode: 'KG_YES', odd: '1.45' },
            { iddaaCode: '3254536', homeTeam: 'Lorient', awayTeam: 'Brest', league: 'Fransa Ligue 1', timeStr: '22:45', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.88' }
        ]
    },
    {
        couponNumber: 10,
        title: "🎯 Öğlen Taraf Güvencesi & Editörün Yıldızı",
        subtitle: "Penafiel (1.63), Voluntari vs Farul MS 2 (1.92) ve Dinamo Kiev 1.5 ÜST (1.25)",
        timeSlot: "noon",
        sessionName: "Öğlen Kuponu",
        sessionTimeRange: "14:00 - 17:30",
        badge: "🎯 Editörün Yıldızı",
        themeColor: '#8B5CF6',
        icon: '🎯',
        picks: [
            { iddaaCode: '3262347', homeTeam: 'Penafiel', awayTeam: 'CD Feirense', league: 'Portekiz 2. Lig', timeStr: '21:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Penafiel Kazanır)', marketCode: 'MS1', odd: '1.63' },
            { iddaaCode: '3255082', homeTeam: 'Voluntari', awayTeam: 'Farul Cons.', league: 'Romanya 1. Lig', timeStr: '18:30', marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Farul Cons. Kazanır)', marketCode: 'MS2', odd: '1.92' },
            { iddaaCode: '3253921', homeTeam: 'Kryvbas K. R.', awayTeam: 'Dinamo Kiev', league: 'Ukrayna Premier Ligi', timeStr: '14:00', marketTitle: 'Toplam Gol', pickTitle: '1.5 ÜST', marketCode: 'OVER15', odd: '1.25' }
        ]
    },

    // -------------------------------------------------------------
    // SEANS 3: AKŞAM KUPONLARI (11 - 15) — GECE SAMBASI & GÜNEY AMERİKA & KAPANIŞ
    // -------------------------------------------------------------
    {
        couponNumber: 11,
        title: "🌙 Akşam / Brezilya Serie A & Kasa Katlama",
        subtitle: "Bragantino 2.5 ÜST (1.41), Goias 2.5 ÜST (1.52) ve CSD Liniers 2.5 ÜST (1.82)",
        timeSlot: "evening",
        sessionName: "Akşam Kuponu",
        sessionTimeRange: "18:30 - 23:30",
        badge: "🌙 Gece Sambası",
        themeColor: '#F59E0B',
        icon: '🌙',
        picks: [
            { iddaaCode: '3266672', homeTeam: 'Bragantino', awayTeam: 'Santos SP', league: 'Brezilya Serie A', timeStr: '02:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.41' },
            { iddaaCode: '3253324', homeTeam: 'Goias GO', awayTeam: 'Crb Al', league: 'Brezilya Serie B', timeStr: '02:30', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.52' },
            { iddaaCode: '3253579', homeTeam: 'CSD Liniers', awayTeam: 'Ituzaingo', league: 'Arjantin Primera B', timeStr: '21:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.82' }
        ]
    },
    {
        couponNumber: 12,
        title: "🛡️ Akşam Sıfır Risk Sigortalı Kombin",
        subtitle: "Gençlerbirliği 2.5 ÜST (1.81), Atromitos 2.5 ÜST (1.69) ve Landskrona 2.5 ÜST (1.38)",
        timeSlot: "evening",
        sessionName: "Akşam Kuponu",
        sessionTimeRange: "18:30 - 23:30",
        badge: "🛡️ Sıfır Risk Gece",
        themeColor: '#10B981',
        icon: '🛡️',
        picks: [
            { iddaaCode: '3262290', homeTeam: 'Gençlerbirliği', awayTeam: 'Alanyaspor', league: 'Türkiye Süper Ligi', timeStr: '20:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.81' },
            { iddaaCode: '3253703', homeTeam: 'Atromitos', awayTeam: 'Volos', league: 'Yunanistan Süper Lig', timeStr: '19:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.69' },
            { iddaaCode: '3262362', homeTeam: 'Landskrona', awayTeam: 'Orebro SK', league: 'İsveç Superettan', timeStr: '21:05', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.38' }
        ]
    },
    {
        couponNumber: 13,
        title: "⚽ Akşam Gol Yağmuru (2.5 ÜST Şöleni)",
        subtitle: "Stal Rzeszow 2.5 ÜST (1.47), LKS Lodz 2.5 ÜST (1.51) ve Zorya 2.5 ÜST (1.48)",
        timeSlot: "evening",
        sessionName: "Akşam Kuponu",
        sessionTimeRange: "18:30 - 23:30",
        badge: "⚽ Gol Şöleni",
        themeColor: '#EC4899',
        icon: '⚽',
        picks: [
            { iddaaCode: '3254602', homeTeam: 'Stal Rzeszow', awayTeam: 'Puszcza', league: 'Polonya 1. Lig', timeStr: '22:30', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.47' },
            { iddaaCode: '3253687', homeTeam: 'LKS Lodz', awayTeam: 'Polonia Warszawa', league: 'Polonya 1. Lig', timeStr: '22:30', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.51' },
            { iddaaCode: '3254538', homeTeam: 'Zorya Luhansk', awayTeam: 'Epicentr Dunaivtsi', league: 'Ukrayna Premier Ligi', timeStr: '14:00', marketTitle: 'Toplam Gol', pickTitle: '2.5 ÜST', marketCode: 'OVER25', odd: '1.48' }
        ]
    },
    {
        couponNumber: 14,
        title: "💎 Akşam Değer & Taraf Kuponu (Güney Amerika & Avrupa)",
        subtitle: "Bragantino MS 1 (1.93), Fortaleza MS 1 (1.84) ve Red Star MS 1 (2.06)",
        timeSlot: "evening",
        sessionName: "Akşam Kuponu",
        sessionTimeRange: "18:30 - 23:30",
        badge: "💎 Yüksek Oran",
        themeColor: '#8B5CF6',
        icon: '💎',
        picks: [
            { iddaaCode: '3266672', homeTeam: 'Bragantino', awayTeam: 'Santos SP', league: 'Brezilya Serie A', timeStr: '02:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Bragantino Kazanır)', marketCode: 'MS1', odd: '1.93' },
            { iddaaCode: '3253258', homeTeam: 'Fortaleza CE', awayTeam: 'Atl Goianiense', league: 'Brezilya Serie B', timeStr: '22:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Fortaleza Kazanır)', marketCode: 'MS1', odd: '1.84' },
            { iddaaCode: '3253418', homeTeam: 'Red Star', awayTeam: 'AS Nancy', league: 'Fransa Ligue 2', timeStr: '22:45', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Red Star Kazanır)', marketCode: 'MS1', odd: '2.06' }
        ]
    },
    {
        couponNumber: 15,
        title: "🌟 Akşam Kapanış Süper Kombini",
        subtitle: "Chojniczanka (1.81), Jong Ajax MS 2 (1.82) ve Athletic Club MG (2.06)",
        timeSlot: "evening",
        sessionName: "Akşam Kuponu",
        sessionTimeRange: "18:30 - 23:30",
        badge: "🌟 Gece Kapanış",
        themeColor: '#F59E0B',
        icon: '🌟',
        picks: [
            { iddaaCode: '3254176', homeTeam: 'Chojniczanka', awayTeam: 'Avia Swidnik', league: 'Polonya 2. Lig', timeStr: '20:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Chojniczanka Kazanır)', marketCode: 'MS1', odd: '1.81' },
            { iddaaCode: '3262341', homeTeam: 'Jong Ajax', awayTeam: 'Vitesse', league: 'Hollanda 1. Lig', timeStr: '22:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 2 (Vitesse Kazanır)', marketCode: 'MS2', odd: '1.82' },
            { iddaaCode: '3254874', homeTeam: 'Athletic Club MG', awayTeam: 'Ceara CE', league: 'Brezilya Serie B', timeStr: '00:00', marketTitle: 'Maç Sonucu', pickTitle: 'MS 1 (Athletic Club Kazanır)', marketCode: 'MS1', odd: '2.06' }
        ]
    }
];

function validateCouponRules(coupons) {
    const counts = {};
    const picksMap = {};
    for (const c of coupons) {
        for (const p of (c.picks || [])) {
            const key = (p.homeTeam + ' vs ' + p.awayTeam).trim().toLowerCase();
            counts[key] = (counts[key] || 0) + 1;
            if (!picksMap[key]) picksMap[key] = [];
            picksMap[key].push({ coupon: c.couponNumber, pickTitle: p.pickTitle, marketCode: p.marketCode });

            if (counts[key] > 2) {
                throw new Error(`KULLANICI KURALI İHLALİ: "${p.homeTeam} vs ${p.awayTeam}" maçı ${counts[key]} kez kullanılmış! (Maksimum 2 kez kuralı çiğnendi)`);
            }
        }
    }

    for (const [key, picks] of Object.entries(picksMap)) {
        if (picks.length === 2) {
            const p1 = picks[0];
            const p2 = picks[1];
            const c1 = (p1.marketCode || p1.pickTitle || '').trim();
            const c2 = (p2.marketCode || p2.pickTitle || '').trim();
            if (c1 === c2) {
                throw new Error(`KULLANICI KURALI İHLALİ: "${key}" maçı Kupon ${p1.coupon} ve Kupon ${p2.coupon}'de AYNI SEÇENEK (${c1}) ile oynanmış! Farklı seçenek olmalıdır.`);
            }
        }
    }
    return true;
}

// Helper to compute total odd
function calculateTotalOdd(picks) {
    return picks.reduce((acc, p) => acc * parseFloat(p.odd || 1), 1);
}

function generateCoupons() {
    const now = new Date();
    const dStr = String(now.getDate()).padStart(2, '0');
    const mStr = String(now.getMonth() + 1).padStart(2, '0');
    const yStr = now.getFullYear();
    const todayFormatted = `${dStr}.${mStr}.${yStr}`;
    const screenshotsDir = path.join(__dirname, '..', 'data_cache', 'screenshots');
    
    const coupons = couponConfigs.map(c => {
        const totalOdd = parseFloat(calculateTotalOdd(c.picks).toFixed(2));
        const picksWithText = c.picks.map(p => ({
            ...p,
            matchText: `${p.timeStr} ${p.homeTeam} - ${p.awayTeam} ${p.pickTitle} ${p.odd}`
        }));

        return {
            couponNumber: c.couponNumber,
            name: `${todayFormatted} - ${c.couponNumber}`,
            title: c.title,
            subtitle: c.subtitle,
            badge: c.badge,
            themeColor: c.themeColor || '#10B981',
            icon: c.icon || '🛡️',
            totalOdd,
            picks: picksWithText,
            savedInAccount: true,
            screenshot: path.join(screenshotsDir, `nesine_kupon_${c.couponNumber}.png`),
            timestamp: new Date().toISOString(),
            timeSlot: c.timeSlot,
            sessionName: c.sessionName,
            sessionTimeRange: c.sessionTimeRange
        };
    });

    // Kural doğrulama kontrolü:
    validateCouponRules(coupons);

    const outputData = {
        date: todayFormatted,
        userAccount: '14410079556',
        generatedAt: new Date().toISOString(),
        totalCoupons: coupons.length,
        sessions: {
            morning: coupons.filter(c => c.timeSlot === 'morning').length,
            noon: coupons.filter(c => c.timeSlot === 'noon').length,
            evening: coupons.filter(c => c.timeSlot === 'evening').length
        },
        description: `${todayFormatted} Seçkin ve Elit Liglerden 15 Kaliteli Kupon (5 Sabah, 5 Öğlen, 5 Akşam) - Max 2 Tekrar & Farklı Seçenek Kuralı Garantili`,
        coupons
    };

    const outPath = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
    fs.writeFileSync(outPath, JSON.stringify(outputData, null, 2), 'utf8');
    console.log(`✅ [BAŞARILI] 15 adet seçkin lig kuponu kaydedildi: ${outPath}`);
    console.log(`✅ [KURAL TEYİDİ] Tüm maçlar en fazla 2 kez ve farklı seçeneklerle oynandı.`);

    return outputData;
}

if (require.main === module) {
    generateCoupons();
}

module.exports = { generateCoupons, couponConfigs, validateCouponRules };
