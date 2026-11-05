const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'js', 'services', 'historicalCouponsService.js');
let code = fs.readFileSync(targetPath, 'utf8');

// Also update build_and_sync_all_data.js threshold
const buildSyncPath = path.join(__dirname, '..', 'scripts', 'build_and_sync_all_data.js');
let buildSyncCode = fs.readFileSync(buildSyncPath, 'utf8');

// In build_and_sync_all_data.js:
buildSyncCode = buildSyncCode.replace(
    'if (histCoupons && histCoupons.length >= 10) {',
    'if (histCoupons && histCoupons.length >= 5) {'
);

buildSyncCode = buildSyncCode.replace(
    `        const morning = CouponEngine.generateDailyCoupons(parsedMatches, true, 5, 'morning');
        const noon = CouponEngine.generateDailyCoupons(parsedMatches, true, 5, 'noon');
        const evening = CouponEngine.generateDailyCoupons(parsedMatches, true, 5, 'evening');
        fullCoupons = [...morning, ...noon, ...evening];`,
    `        const sessionRes = CouponEngine.generateSessionCoupons(parsedMatches, true);
        fullCoupons = sessionRes.all;`
);

fs.writeFileSync(buildSyncPath, buildSyncCode, 'utf8');
console.log('✅ build_and_sync_all_data.js güncellendi.');

// In historicalCouponsService.js, replace the matches and couponDefs of _generateAuthentic2026_11_03Coupons
const generatorFile = fs.readFileSync(path.join(__dirname, 'generate_today_coupons.js'), 'utf8');

// Extract matches block from generate_today_coupons.js
const mStart = generatorFile.indexOf('const matches = {');
const mEnd = generatorFile.indexOf('function createPick(');
const newMatchesBlock = generatorFile.slice(mStart, mEnd).trim();

// Extract couponDefs block from generate_today_coupons.js
const cStart = generatorFile.indexOf('const couponDefs = [');
const cEnd = generatorFile.indexOf('const formattedCoupons = couponDefs.map(');
const newCouponDefsBlock = generatorFile.slice(cStart, cEnd).trim();

// Locate in historicalCouponsService.js
const targetStart = code.indexOf('// 2. Tarayıcı / Çevrimdışı Güvenlik Ağı');
const targetEnd = code.indexOf('const generatedCoupons = couponDefs.map(');

if (targetStart !== -1 && targetEnd !== -1) {
    const replacement = `// 2. Tarayıcı / Çevrimdışı Güvenlik Ağı (03 Kasım 2026 Kesin Seans Kuponları - Kalite Odaklı Uzman Analizi)
${newMatchesBlock}

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
        matchText: \`\${mObj.timeStr} \${mObj.homeTeam} - \${mObj.awayTeam} \${opt.pickTitle} \${opt.odd}\`
    };
}

${newCouponDefsBlock}
`;
    code = code.slice(0, targetStart) + replacement + '\n        ' + code.slice(targetEnd);
    fs.writeFileSync(targetPath, code, 'utf8');
    console.log('✅ historicalCouponsService.js güncellendi.');
} else {
    console.error('❌ historicalCouponsService.js blokları bulunamadı.');
}
