const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'analysis', 'couponEngine.js');
let code = fs.readFileSync(targetPath, 'utf8');

// 1. Update getMatchHour to be extra resilient for all time properties
const oldGetMatchHour = `    getMatchHour(match) {
        if (!match) return 20;
        const timeStr = match.timeStr 
            || match.kickoffTime
            || match.match?.kickoffTime
            || (match.matchDate ? match.matchDate.split('T')[1]?.slice(0, 5) : null)
            || (match.match?.timeStr)
            || '';
        if (timeStr && timeStr.includes(':')) {
            const h = parseInt(timeStr.trim().split(':')[0], 10);
            if (!isNaN(h)) return h;
        }
        return 20;
    },`;

const newGetMatchHour = `    getMatchHour(match) {
        if (!match) return 20;
        const timeStr = match.timeStr 
            || match.matchTime
            || match.kickoffTime
            || match.time
            || match.match?.kickoffTime
            || match.match?.timeStr
            || match.match?.matchTime
            || (match.matchDate && typeof match.matchDate === 'string' && match.matchDate.includes('T') ? match.matchDate.split('T')[1].slice(0, 5) : null)
            || (match.rawData?.D)
            || '';
        if (timeStr && typeof timeStr === 'string' && timeStr.includes(':')) {
            const h = parseInt(timeStr.trim().split(':')[0], 10);
            if (!isNaN(h)) return h;
        }
        return 20;
    },`;

// 2. Update getMatchTimeSlot
const oldGetMatchTimeSlot = `    getMatchTimeSlot(match) {
        const h = this.getMatchHour(match);
        if (h >= 0 && h < 12) return 'morning'; // 00:00 - 11:59 (Sabah & Gece)
        if (h >= 12 && h < 18) return 'noon';   // 12:00 - 17:59 (Öğlen)
        return 'evening';                       // 18:00 - 23:59 (Akşam)
    },`;

const newGetMatchTimeSlot = `    getMatchTimeSlot(match) {
        const h = this.getMatchHour(match);
        // KULLANICI KURALI:
        // Sabah: 00:00 - 12:00 | Öğlen: 12:00 - 18:00 | Akşam: 18:00 - 23:59
        if (h >= 0 && h < 12) return 'morning'; // 00:00 - 11:59 (Sabah Seansı)
        if (h >= 12 && h < 18) return 'noon';   // 12:00 - 17:59 (Öğlen Seansı)
        return 'evening';                       // 18:00 - 23:59 (Akşam Seansı)
    },`;

// 3. Update generateDailyCoupons signature and time filtering
const oldGenSignature = `    generateDailyCoupons(matches = [], forceNew = false, maxCoupons = null, timeSlot = 'all') {`;
const newGenSignature = `    generateDailyCoupons(matches = [], forceNew = false, maxCoupons = null, timeSlot = 'all', sharedTracker = null) {`;

const oldSlotFilter = `        // KULLANICI KURALI: Zaman dilimi seçildiyse (Sabah, Öğlen, Akşam) o saatteki maçları filtrele
        if (timeSlot && timeSlot !== 'all') {
            const slotFiltered = targetMatches.filter(m => this.getMatchTimeSlot(m) === timeSlot);
            if (slotFiltered.length >= 3) {
                targetMatches = slotFiltered;
            }
        }`;

const newSlotFilter = `        // KULLANICI KURALI: 
        // "saat 00:00dan 12:00a kadar sabaha macları olacak 12:00 18:00a kadar olana maclar öglen macları 18:00 dan da 23:59 a kadar olan maclar aksam macları olacak"
        // "mac yoksa kupon yapma şart değil her vakit 5 kupon hazırlaman garanti saglam olsun 5den az olsun"
        if (timeSlot && timeSlot !== 'all') {
            targetMatches = targetMatches.filter(m => this.getMatchTimeSlot(m) === timeSlot);
            if (targetMatches.length < 3) {
                // Seans için en az 3 banko maç yoksa kesinlikle kupon üretilmez ("maç yoksa kupon yapma")
                return [];
            }
        }`;

// 4. Update tracker initialization in generateDailyCoupons
const oldTrackers = `        const usedMatchKeys = new Set();
        const usedPicksByMatch = new Map(); // matchKey -> Set of { marketCode, shortPick }
        const usedCategoriesByMatch = new Map(); // matchKey -> Set of categories
        const matchUsageCount = new Map(); // matchKey -> number of coupons containing this match
        const getMatchKey = m => (m.id || (m.homeTeam + '_' + m.awayTeam));`;

const newTrackers = `        const usedMatchKeys = new Set();
        const usedPicksByMatch = (sharedTracker && sharedTracker.usedPicksByMatch) || new Map();
        const usedCategoriesByMatch = (sharedTracker && sharedTracker.usedCategoriesByMatch) || new Map();
        const matchUsageCount = (sharedTracker && sharedTracker.matchUsageCount) || new Map();
        const getMatchKey = m => (m.id || (m.homeTeam + '_' + m.awayTeam));`;

// 5. Update selectPicksForCoupon to strictly check timeSlot for every candidate match
const oldCandLoopStart = `            pool.forEach(item => {
                // KULLANICI KURALI: "Bilyoner ve Nesine.com'da bahisler açılmışsa kupona dahil et, eğer bahis oynanmıyorsa kupona yazma"
                if (!this.isBettingOpenOnPlatforms(item.match)) return;

                const key = getMatchKey(item.match);`;

const newCandLoopStart = `            pool.forEach(item => {
                // KULLANICI KURALI: "Bilyoner ve Nesine.com'da bahisler açılmışsa kupona dahil et, eğer bahis oynanmıyorsa kupona yazma"
                if (!this.isBettingOpenOnPlatforms(item.match)) return;

                // KULLANICI KURALI: Kesin Seans Saat Sınırı Kontrolü (Sabah 00:00-12:00, Öğlen 12:00-18:00, Akşam 18:00-23:59)
                if (timeSlot && timeSlot !== 'all') {
                    if (this.getMatchTimeSlot(item.match) !== timeSlot) return;
                }

                const key = getMatchKey(item.match);`;

// 6. Update coupon labeling and ceiling at end of generateDailyCoupons
const oldCouponLabeling = `        // KULLANICI KURALI: Her kupona saatine göre zaman dilimi ata (Sabah, Öğlen, Akşam)
        coupons.forEach(c => {
            if (!c.timeSlot) c.timeSlot = this.getCouponTimeSlot(c);
            if (!c.sessionName) c.sessionName = (c.timeSlot === 'morning' ? 'Sabah & Gece Kuponu' : (c.timeSlot === 'noon' ? 'Öğlen Kuponu' : 'Akşam Kuponu'));
        });`;

const newCouponLabeling = `        // KULLANICI KURALI: Seans etiketleri ve saat aralıkları
        coupons.forEach(c => {
            const slot = (timeSlot && timeSlot !== 'all') ? timeSlot : this.getCouponTimeSlot(c);
            c.timeSlot = slot;
            if (slot === 'morning') {
                c.sessionName = 'Sabah Seansı (00:00 - 12:00)';
                c.sessionTimeRange = '00:00 - 12:00';
            } else if (slot === 'noon') {
                c.sessionName = 'Öğlen Seansı (12:00 - 18:00)';
                c.sessionTimeRange = '12:00 - 18:00';
            } else {
                c.sessionName = 'Akşam Seansı (18:00 - 23:59)';
                c.sessionTimeRange = '18:00 - 23:59';
            }
        });`;

// Normalize CRLF to LF for matching, then we can write back
const normalize = s => s.replace(/\r\n/g, '\n');

code = normalize(code);

function replaceExact(source, searchStr, replaceStr, label) {
    const sNorm = normalize(searchStr);
    const rNorm = normalize(replaceStr);
    if (!source.includes(sNorm)) {
        console.error(`❌ Bulunamadı: ${label}`);
        return source;
    }
    console.log(`✅ Değiştirildi: ${label}`);
    return source.replace(sNorm, rNorm);
}

code = replaceExact(code, oldGetMatchHour, newGetMatchHour, 'getMatchHour');
code = replaceExact(code, oldGetMatchTimeSlot, newGetMatchTimeSlot, 'getMatchTimeSlot');
code = replaceExact(code, oldGenSignature, newGenSignature, 'generateDailyCoupons signature');
code = replaceExact(code, oldSlotFilter, newSlotFilter, 'timeSlot filter');
code = replaceExact(code, oldTrackers, newTrackers, 'sharedTracker trackers');
code = replaceExact(code, oldCandLoopStart, newCandLoopStart, 'selectPicksForCoupon timeSlot check');
code = replaceExact(code, oldCouponLabeling, newCouponLabeling, 'coupon labeling & sessionTimeRange');

// Add generateSessionCoupons method if not already present
if (!code.includes('generateSessionCoupons(')) {
    const sessionCouponsMethod = `
    /**
     * KULLANICI KURALI: 
     * "saat 00:00dan 12:00a kadar sabaha macları olacak 12:00 18:00a kadar olana maclar öglen macları 
     * 18:00 dan da 23:59 a kadar olan maclar aksam macları olacak bundan sonra bu şekilde hazırla kuponları 
     * mac yoksa kupon yapma şart değil her vakit 5 kupon hazırlaman garanti saglam olsun 5den az olsun sen uzman bir iddaa analistisin buna göre düşün"
     * 
     * Günün kuponlarını 3 kesin zaman dilimine ayırır:
     * - Sabah: 00:00 - 12:00
     * - Öğlen: 12:00 - 18:00
     * - Akşam: 18:00 - 23:59
     * 
     * Maç yoksa kupon YAPILMAZ. Sabit 5 kupon zorunluluğu yoktur; garanti ve sağlam kuponlar üretilir (5'ten az olabilir).
     * Tüm seanslar boyunca aynı maç en fazla 2 kuponda yer alabilir (2. kullanımda %100 farklı bahis pazarı zorunludur).
     */
    generateSessionCoupons(matches = [], forceNew = false) {
        const sharedTracker = {
            matchUsageCount: new Map(),
            usedPicksByMatch: new Map(),
            usedCategoriesByMatch: new Map()
        };

        // 1. Sabah Seansı (00:00 - 12:00)
        const morning = this.generateDailyCoupons(matches, forceNew, 5, 'morning', sharedTracker);

        // 2. Öğlen Seansı (12:00 - 18:00)
        const noon = this.generateDailyCoupons(matches, forceNew, 5, 'noon', sharedTracker);

        // 3. Akşam Seansı (18:00 - 23:59)
        const evening = this.generateDailyCoupons(matches, forceNew, 5, 'evening', sharedTracker);

        const all = [...morning, ...noon, ...evening];
        all.forEach((c, idx) => {
            c.couponNumber = idx + 1;
        });

        return {
            morning,
            noon,
            evening,
            all,
            totalCoupons: all.length,
            sessionCounts: {
                morning: morning.length,
                noon: noon.length,
                evening: evening.length
            }
        };
    },
`;

    // Insert right after generateDailyCoupons ends (before expandTo8Coupons)
    const anchor = 'expandTo8Coupons(baseCoupons = [], matches = [], dateStr = \'today\') {';
    if (code.includes(anchor)) {
        code = code.replace(anchor, sessionCouponsMethod + '\n    ' + anchor);
        console.log('✅ generateSessionCoupons metodu eklendi.');
    } else {
        console.error('❌ expandTo8Coupons anchor bulunamadı.');
    }
}

// Convert back to CRLF for consistency with the existing repo
const crlfCode = code.replace(/\n/g, '\r\n');
fs.writeFileSync(targetPath, crlfCode, 'utf8');
console.log('💾 couponEngine.js başarıyla güncellendi.');

