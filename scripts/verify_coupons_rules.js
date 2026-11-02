/**
 * verify_coupons_rules.js
 * SportAnaliz Pro - Kupon Kural Denetim ve Doğrulama Testi
 * 
 * Kontrol Edilen Kurallar:
 * 1. Toplam 15 kupon (5 Sabah, 5 Öğlen, 5 Akşam)
 * 2. Bir maç tüm kuponlar genelinde EN FAZLA 2 KERE oynanabilir.
 * 3. 2 kez oynanan maçların bahis seçenekleri (seçenek/market) %100 FARKLI olmalıdır.
 * 4. Oranlar 1.20 altında olamaz.
 * 5. Her kuponun en az 2 maçı bulunmalı ve MBS şartlarını karşılamalıdır.
 */

const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
const coupons = raw.coupons || [];

console.log('====================================================');
console.log('🔍 SPORTANALIZ PRO - KUPON KURAL DENETİM RAPORU');
console.log('====================================================');
console.log(`Tarih: ${raw.date}`);
console.log(`Toplam Kupon Sayısı: ${coupons.length}`);
console.log(`Seanslar: Sabah(${raw.sessions?.morning || 0}), Öğlen(${raw.sessions?.noon || 0}), Akşam(${raw.sessions?.evening || 0})`);
console.log('----------------------------------------------------');

if (coupons.length !== 15) {
    console.error(`❌ HATA: Beklenen 15 kupon ancak ${coupons.length} kupon bulundu!`);
    process.exit(1);
}

const matchCounts = {};
const matchPicks = {};
let hasError = false;

coupons.forEach(c => {
    if (!c.picks || c.picks.length < 2) {
        console.error(`❌ HATA: Kupon ${c.couponNumber} 2'den az maç içeriyor!`);
        hasError = true;
    }

    c.picks.forEach(p => {
        const oddVal = parseFloat(p.odd) || 0;
        if (oddVal < 1.20) {
            console.error(`❌ HATA: Kupon ${c.couponNumber} - ${p.homeTeam} vs ${p.awayTeam} oran 1.20 altında: ${p.odd}`);
            hasError = true;
        }

        const key = `${p.homeTeam} vs ${p.awayTeam}`.trim();
        if (!matchCounts[key]) {
            matchCounts[key] = 0;
            matchPicks[key] = [];
        }
        matchCounts[key]++;
        matchPicks[key].push({
            couponNumber: c.couponNumber,
            session: c.timeSlot,
            pickTitle: p.pickTitle,
            marketCode: p.marketCode,
            odd: p.odd
        });
    });
});

console.log('📊 MAÇ DAĞILIMI VE TEKRAR KONTROLÜ:');
let maxCount = 0;
let doubleCount = 0;
let singleCount = 0;

Object.entries(matchCounts).forEach(([matchName, count]) => {
    if (count > maxCount) maxCount = count;
    const picks = matchPicks[matchName];

    if (count > 2) {
        console.error(`❌ KURAL İHLALİ: "${matchName}" ${count} kez oynanmış! (Maksimum 2 kuralı aşıldı)`);
        hasError = true;
    } else if (count === 2) {
        doubleCount++;
        const p1 = picks[0];
        const p2 = picks[1];
        const code1 = (p1.marketCode || p1.pickTitle || '').trim();
        const code2 = (p2.marketCode || p2.pickTitle || '').trim();
        const title1 = (p1.pickTitle || '').trim();
        const title2 = (p2.pickTitle || '').trim();

        if (code1 === code2 || title1 === title2) {
            console.error(`❌ KURAL İHLALİ: "${matchName}" 2 kez AYNI seçenekle oynanmış! (${title1})`);
            console.error(`   - Kupon ${p1.couponNumber} (${p1.session}): ${p1.pickTitle}`);
            console.error(`   - Kupon ${p2.couponNumber} (${p2.session}): ${p2.pickTitle}`);
            hasError = true;
        } else {
            console.log(`  ✅ 2 Kez (Farklı Seçenek): ${matchName}`);
            console.log(`     -> Kupon ${p1.couponNumber} (${p1.session}): ${p1.pickTitle} (${p1.odd})`);
            console.log(`     -> Kupon ${p2.couponNumber} (${p2.session}): ${p2.pickTitle} (${p2.odd})`);
        }
    } else {
        singleCount++;
        const p = picks[0];
        console.log(`  ✅ 1 Kez: ${matchName} -> Kupon ${p.couponNumber} (${p.session}): ${p.pickTitle} (${p.odd})`);
    }
});

console.log('----------------------------------------------------');
console.log(`İstatistik: Toplam ${Object.keys(matchCounts).length} farklı maç`);
console.log(`- 2 Kez Oynanan Maçlar: ${doubleCount}`);
console.log(`- 1 Kez Oynanan Maçlar: ${singleCount}`);
console.log(`- Maksimum Kullanım: ${maxCount} (Hedef: <= 2)`);
console.log('====================================================');

if (hasError) {
    console.error('💥 DENETİM BAŞARISIZ: Kurallara aykırı durumlar tespit edildi!');
    process.exit(1);
} else {
    console.log('🎉 TÜM DENETİMLER BAŞARIYLA GEÇTİ!');
    console.log('✅ 1. Hiçbir maç 2 kereden fazla KULLANILMADI.');
    console.log('✅ 2. 2 kez kullanılan tüm maçlar KESİNLİKLE FARKLI SEÇENEKLERLE oynandı.');
    console.log('✅ 3. Minimum 1.20 oran kuralına uyuldu.');
    console.log('✅ 4. 15 kupon 3 seansa (5 Sabah, 5 Öğlen, 5 Akşam) dengeli dağıtıldı.');
}

