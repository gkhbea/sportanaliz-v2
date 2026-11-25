/**
 * deep_coupon_analysis.js
 * SportAnaliz Pro — 80 Kuponun Kapsamlı Veri & Algoritma Analizi
 */

const fs = require('fs');
const path = require('path');

// 1. Günlük kupon listelerini alalım (generate_excel_tracker.js içindeki verilerle uyumlu)
const c06 = [
    { name: "06.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.08, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Smouha SC", pickTitle: "MS 1", odd: 1.20, won: false }, { homeTeam: "Lamphun", pickTitle: "MS 1", odd: 1.39, won: true }, { homeTeam: "Polissya", pickTitle: "1X", odd: 1.25, won: true }] },
    { name: "06.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Karabağ", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Sogdiana", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Madura Utd", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "06.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Dibba", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "AL Dhaid", pickTitle: "1.5 ÜST", odd: 1.45, won: false }, { homeTeam: "Al Fehaheel", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "06.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 4.85, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Obolon Kiev", pickTitle: "1.5 ALT", odd: 2.75, won: false }, { homeTeam: "WA Tlemcen", pickTitle: "1.5 ALT", odd: 2.75, won: true }] },
    { name: "06.11.2026 - 5", title: "🌟 Günün Yıldız Kuponu / Süper Kombine", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Schalke II", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Nrb Nezla", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Newroz SC", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "06.11.2026 - 6", title: "🏆 UEFA Şampiyonlar Ligi Özel", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Ballinamallard", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Moyola Park", pickTitle: "1.5 ÜST", odd: 1.45, won: false }, { homeTeam: "Llanelli", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "06.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.98, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Belgrano (K)", pickTitle: "1X", odd: 1.25, won: true }, { homeTeam: "Qalali", pickTitle: "3.5 ALT", odd: 1.60, won: true }, { homeTeam: "Everton", pickTitle: "MS 1", odd: 1.49, won: true }] },
    { name: "06.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "VVV Venlo", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Wisla Krakow", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Enppi Club", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "06.11.2026 - 9", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 18.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Rapid Wien", pickTitle: "İY1/MS1", odd: 1.85, won: false }, { homeTeam: "Hammarby", pickTitle: "İY1/MS1", odd: 1.85, won: true }] },
    { name: "06.11.2026 - 10", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Neftçi", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Viktoria Köln", pickTitle: "1.5 ÜST", odd: 1.45, won: false }] }
];

const c07 = [
    { name: "07.11.2026 - 1", title: "🛡️ Cumartesi Garantör Banko", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.15, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Eyüpspor", pickTitle: "1.5 ÜST", odd: 1.28, won: true }, { homeTeam: "Bayern Münih", pickTitle: "MS 1", odd: 1.22, won: true }, { homeTeam: "Real Madrid", pickTitle: "MS 1", odd: 1.38, won: true }] },
    { name: "07.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.12, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Liverpool", pickTitle: "2.5 ÜST", odd: 1.48, won: true }, { homeTeam: "Dortmund", pickTitle: "1X", odd: 1.32, won: true }, { homeTeam: "Juventus", pickTitle: "MS 1", odd: 1.60, won: true }] },
    { name: "07.11.2026 - 3", title: "⚽ Cumartesi Gol Yağmuru", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.85, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Brighton", pickTitle: "2.5 ÜST", odd: 1.52, won: true }, { homeTeam: "Villarreal", pickTitle: "1.5 ÜST", odd: 1.30, won: false }] },
    { name: "07.11.2026 - 4", title: "💎 Değer / Value Taraf Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 4.85, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Cagliari", pickTitle: "MS 2", odd: 1.72, won: true }, { homeTeam: "Angers", pickTitle: "MS 2", odd: 1.82, won: true }, { homeTeam: "Samsunspor", pickTitle: "MS 1", odd: 1.55, won: true }] },
    { name: "07.11.2026 - 5", title: "🌟 Süper Kombin (Gece Seansı)", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 5.40, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Botafogo", pickTitle: "MS 1", odd: 1.42, won: true }, { homeTeam: "Cruzeiro", pickTitle: "MS 1", odd: 1.55, won: true }, { homeTeam: "Palmeiras", pickTitle: "MS 1", odd: 1.86, won: true }] }
];

const c08 = [
    { name: "08.11.2026 - 1", title: "🛡️ Pazar Süper Lig Banko Kombin", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.22, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Galatasaray", pickTitle: "MS 1", odd: 1.35, won: true }, { homeTeam: "Fenerbahçe", pickTitle: "MS 1", odd: 1.25, won: true }, { homeTeam: "Göztepe", pickTitle: "1X", odd: 1.32, won: true }] },
    { name: "08.11.2026 - 2", title: "⚡ Premier League & Serie A İdeal", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.45, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Chelsea", pickTitle: "KG VAR", odd: 1.65, won: true }, { homeTeam: "Inter", pickTitle: "1.5 ÜST", odd: 1.32, won: true }] },
    { name: "08.11.2026 - 3", title: "⚽ Pazar Gol Düellosu Kombini", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.95, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Sociedad", pickTitle: "2.5 ÜST", odd: 1.55, won: false }, { homeTeam: "Monza", pickTitle: "X2", odd: 1.34, won: true }] },
    { name: "08.11.2026 - 4", title: "💎 Akılcı Değer & Taraf Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.80, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Stuttgart", pickTitle: "2.5 ÜST", odd: 1.52, won: true }, { homeTeam: "Atletico Madrid", pickTitle: "MS 2", odd: 1.54, won: true }] },
    { name: "08.11.2026 - 5", title: "🌙 Güney Amerika & Gece Kapanış", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 4.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Sao Paulo", pickTitle: "MS 1", odd: 1.65, won: true }, { homeTeam: "Flamengo", pickTitle: "1X", odd: 1.38, won: true }] }
];

const c09 = [
    { name: "09.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.38, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Goias", pickTitle: "MS 1", odd: 1.25, won: true }, { homeTeam: "Ceara", pickTitle: "1X", odd: 1.25, won: true }, { homeTeam: "Garcilaso", pickTitle: "MS 1", odd: 1.52, won: true }] },
    { name: "09.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "D. Saprissa", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "CD Fas", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Marathon", pickTitle: "1.5 ÜST", odd: 1.45, won: false }, { homeTeam: "U. Deportes", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 11.97, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "C. Cordoba", pickTitle: "MS 1", odd: 2.72, won: false }, { homeTeam: "Dep. La Guaira", pickTitle: "MS 1", odd: 2.75, won: true }] },
    { name: "09.11.2026 - 5", title: "🌟 Günün Yıldız Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Piratas", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Queretaro", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 6", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Politehnica", pickTitle: "MS 1", odd: 1.25, won: true }, { homeTeam: "Chernomorets", pickTitle: "1X", odd: 1.25, won: true }] },
    { name: "09.11.2026 - 7", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.99, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "CSKA Sofia II", pickTitle: "MS 1", odd: 1.45, won: true }, { homeTeam: "Coventry U21", pickTitle: "2.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 8", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.98, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Pineto", pickTitle: "1X", odd: 1.50, won: true }, { homeTeam: "Atl Madrid (K)", pickTitle: "MS 1", odd: 1.28, won: true }] },
    { name: "09.11.2026 - 9", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Hvidovre", pickTitle: "1.5 ÜST", odd: 1.45, won: false }, { homeTeam: "Fratria", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 10", title: "⚡ İY / MS Özel Analiz Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 16.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Las Palmas", pickTitle: "İY1/MS1", odd: 4.86, won: false }] },
    { name: "09.11.2026 - 11", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Torreense", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Botosani", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "09.11.2026 - 12", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 11.25, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Kristiansund", pickTitle: "MS 1", odd: 1.55, won: true }, { homeTeam: "Independiente", pickTitle: "MS 1", odd: 2.75, won: false }] }
];

const c10 = [
    { name: "10.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.56, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Gimnasia", pickTitle: "1X", odd: 1.32, won: true }, { homeTeam: "Tigre", pickTitle: "1.5 ÜST", odd: 1.40, won: true }] },
    { name: "10.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Platense", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Racing", pickTitle: "MS 2", odd: 1.45, won: true }] },
    { name: "10.11.2026 - 3", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Jong Ajax", pickTitle: "1.5 ÜST", odd: 1.25, won: true }, { homeTeam: "Den Bosch", pickTitle: "1X", odd: 1.30, won: true }] },
    { name: "10.11.2026 - 4", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Cambuur", pickTitle: "2.5 ÜST", odd: 1.55, won: false }, { homeTeam: "Dordrecht", pickTitle: "KG VAR", odd: 1.45, won: true }] },
    { name: "10.11.2026 - 5", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.81, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Helmond", pickTitle: "1.5 ÜST", odd: 1.22, won: true }, { homeTeam: "Oss", pickTitle: "1.5 ÜST", odd: 1.25, won: true }] },
    { name: "10.11.2026 - 6", title: "🏆 UEFA Avrupa & Konferans Ligi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Galatasaray", pickTitle: "MS 1", odd: 1.45, won: true }, { homeTeam: "Tottenham", pickTitle: "2.5 ÜST", odd: 1.45, won: true }] },
    { name: "10.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.59, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Lazio", pickTitle: "MS 1", odd: 1.38, won: true }, { homeTeam: "Ajax", pickTitle: "1.5 ÜST", odd: 1.28, won: true }] },
    { name: "10.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Roma", pickTitle: "MS 1", odd: 1.52, won: false }, { homeTeam: "Bilbao", pickTitle: "1X", odd: 1.32, won: true }] },
    { name: "10.11.2026 - 9", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "FCSB", pickTitle: "2.5 ÜST", odd: 1.65, won: true }, { homeTeam: "Midtjylland", pickTitle: "2.5 ÜST", odd: 1.55, won: false }] },
    { name: "10.11.2026 - 10", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 9.40, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "PAOK", pickTitle: "MS 2", odd: 2.85, won: false }, { homeTeam: "Braga", pickTitle: "MS 1", odd: 2.10, won: true }] }
];

const c11 = [
    { name: "11.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.28, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Flamengo", pickTitle: "MS 1", odd: 1.45, won: true }, { homeTeam: "Vasco", pickTitle: "1X", odd: 1.32, won: true }, { homeTeam: "Gremio", pickTitle: "1.5 ÜST", odd: 1.30, won: true }] },
    { name: "11.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.09, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Corinthians", pickTitle: "MS 1", odd: 1.42, won: true }, { homeTeam: "Santos", pickTitle: "1.5 ÜST", odd: 1.35, won: true }] },
    { name: "11.11.2026 - 3", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.61, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Ulsan", pickTitle: "MS 1", odd: 1.45, won: true }, { homeTeam: "Jeonbuk", pickTitle: "1X", odd: 1.34, won: true }] },
    { name: "11.11.2026 - 4", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Vissel Kobe", pickTitle: "MS 1", odd: 1.60, won: false }, { homeTeam: "Yokohama", pickTitle: "2.5 ÜST", odd: 1.55, won: true }] },
    { name: "11.11.2026 - 5", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Kawasaki", pickTitle: "1.5 ÜST", odd: 1.25, won: true }, { homeTeam: "Gamba Osaka", pickTitle: "1.5 ÜST", odd: 1.30, won: true }] },
    { name: "11.11.2026 - 6", title: "🏆 UEFA Avrupa Özel Kombinesi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 1.74, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Man United", pickTitle: "1X", odd: 1.20, won: true }, { homeTeam: "Porto", pickTitle: "MS 1", odd: 1.35, won: true }] },
    { name: "11.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.03, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Frankfurt", pickTitle: "1.5 ÜST", odd: 1.25, won: true }, { homeTeam: "Lyon", pickTitle: "1X", odd: 1.30, won: true }] },
    { name: "11.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Besiktas", pickTitle: "MS 1", odd: 1.62, won: false }, { homeTeam: "Malmö", pickTitle: "KG VAR", odd: 1.50, won: true }] },
    { name: "11.11.2026 - 9", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Anderlecht", pickTitle: "2.5 ÜST", odd: 1.55, won: false }, { homeTeam: "Olympiakos", pickTitle: "2.5 ÜST", odd: 1.50, won: true }] },
    { name: "11.11.2026 - 10", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 9.11, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Rangers", pickTitle: "MS 2", odd: 2.90, won: false }, { homeTeam: "Slavia Prag", pickTitle: "MS 2", odd: 2.40, won: true }] }
];

const c12 = [
    { name: "12.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.50, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Internacional", pickTitle: "MS 1", odd: 1.40, won: true }, { homeTeam: "Fluminense", pickTitle: "1X", odd: 1.35, won: true }] },
    { name: "12.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Sao Paulo", pickTitle: "1.5 ÜST", odd: 1.45, won: true }, { homeTeam: "Bahia", pickTitle: "1.5 ÜST", odd: 1.45, won: true }] },
    { name: "12.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Fortaleza", pickTitle: "2.5 ÜST", odd: 1.55, won: false }, { homeTeam: "Juventude", pickTitle: "KG VAR", odd: 1.65, won: true }] },
    { name: "12.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 4.70, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Cruzeiro", pickTitle: "MS 1", odd: 2.10, won: true }, { homeTeam: "Atletico PR", pickTitle: "MS 1", odd: 1.75, won: true }] },
    { name: "12.11.2026 - 5", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.90, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Hilal", pickTitle: "MS 1", odd: 1.25, won: true }, { homeTeam: "Al Nassr", pickTitle: "MS 1", odd: 1.32, won: true }, { homeTeam: "Al Ittihad", pickTitle: "1.5 ÜST", odd: 1.35, won: true }] },
    { name: "12.11.2026 - 6", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Ahli", pickTitle: "2.5 ÜST", odd: 1.52, won: true }, { homeTeam: "Al Shabab", pickTitle: "KG VAR", odd: 1.45, won: true }] },
    { name: "12.11.2026 - 7", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Taawon", pickTitle: "1.5 ÜST", odd: 1.28, won: true }, { homeTeam: "Al Fateh", pickTitle: "1.5 ÜST", odd: 1.30, won: true }] },
    { name: "12.11.2026 - 8", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 16.79, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Al Ettifaq", pickTitle: "MS 2", odd: 3.20, won: false }, { homeTeam: "Al Wehda", pickTitle: "MS 1", odd: 2.90, won: false }] },
    { name: "12.11.2026 - 9", title: "🏆 UEFA Avrupa Özel Kombinesi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.56, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Fenerbahçe", pickTitle: "MS 1", odd: 1.38, won: true }, { homeTeam: "Chelsea", pickTitle: "1.5 ÜST", odd: 1.28, won: true }] },
    { name: "12.11.2026 - 10", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Fiorentina", pickTitle: "1X", odd: 1.22, won: true }, { homeTeam: "Betis", pickTitle: "MS 1", odd: 1.35, won: true }] },
    { name: "12.11.2026 - 11", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Panathinaikos", pickTitle: "MS 1", odd: 1.65, won: false }, { homeTeam: "Legia", pickTitle: "KG VAR", odd: 1.50, won: true }] },
    { name: "12.11.2026 - 12", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 152.83, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Lugano", pickTitle: "İY1/MS1", odd: 4.50, won: false }, { homeTeam: "Gent", pickTitle: "İY1/MS1", odd: 3.80, won: false }] },
    { name: "12.11.2026 - 13", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Heidenheim", pickTitle: "2.5 ÜST", odd: 1.55, won: true }, { homeTeam: "Cercle Brugge", pickTitle: "2.5 ÜST", odd: 1.55, won: false }] }
];

// 13.11 bugünkü kuponlar
const todayFile = path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json');
const todayData = JSON.parse(fs.readFileSync(todayFile, 'utf8'));
const c13 = todayData.coupons.map(c => ({
    ...c,
    status: "⏳ Beklemede",
    stake: 50
}));

const completedCoupons = [...c06, ...c07, ...c08, ...c09, ...c10, ...c11, ...c12];
const allCoupons = [...completedCoupons, ...c13];

// 2. Kategori bazında grupla
const categoryMap = {};
completedCoupons.forEach(c => {
    let cat = "Diğer";
    if (c.title.includes("Garantör") || c.title.includes("Banko")) cat = "🛡️ Garantör / Banko";
    else if (c.title.includes("İdeal")) cat = "⚡ İdeal Editör Kuponu";
    else if (c.title.includes("Gol") || c.title.includes("Düello")) cat = "⚽ Gol Kombineleri";
    else if (c.title.includes("Sürpriz") || c.title.includes("Değer") || c.title.includes("Value")) cat = "💎 Değer (Value) & Sürpriz";
    else if (c.title.includes("UEFA") || c.title.includes("Avrupa") || c.title.includes("Süper Lig") || c.title.includes("Kombin") || c.title.includes("Yıldız")) cat = "🌟 Özel Lig & Prestij Kombini";
    else if (c.title.includes("İY / MS") || c.title.includes("Sistem")) cat = "🎯 İY/MS Sistem";

    if (!categoryMap[cat]) {
        categoryMap[cat] = { count: 0, won: 0, lost: 0, totalStake: 0, totalReturn: 0 };
    }
    categoryMap[cat].count++;
    categoryMap[cat].totalStake += c.stake;
    if (c.status.includes("Kazandı")) {
        categoryMap[cat].won++;
        categoryMap[cat].totalReturn += c.stake * c.totalOdd;
    } else {
        categoryMap[cat].lost++;
    }
});

// 3. Tercih (Pick Market) bazında grupla
const marketMap = {};
completedCoupons.forEach(c => {
    c.picks.forEach(p => {
        let title = p.pickTitle;
        let normMarket = "Diğer";
        if (title.includes("1X") || title.includes("X2")) normMarket = "Çifte Şans (1X / X2)";
        else if (title.includes("MS 1") || title.includes("Kazanır") || title.includes("MS 2")) normMarket = "Maç Sonucu (MS 1 / MS 2)";
        else if (title.includes("1.5 ÜST") || title.includes("1.5 Üst")) normMarket = "1.5 Üst";
        else if (title.includes("2.5 ÜST") || title.includes("2.5 Üst")) normMarket = "2.5 Üst";
        else if (title.includes("1.5 ALT") || title.includes("3.5 ALT")) normMarket = "Alt Tercihleri (1.5 / 3.5 Alt)";
        else if (title.includes("KG VAR") || title.includes("KG YOK")) normMarket = "Karşılıklı Gol (Var/Yok)";
        else if (title.includes("İY1/MS1") || title.includes("İY")) normMarket = "İY / İY-MS Özel";

        if (!marketMap[normMarket]) {
            marketMap[normMarket] = { count: 0, won: 0, totalOdd: 0 };
        }
        marketMap[normMarket].count++;
        marketMap[normMarket].totalOdd += parseFloat(p.odd) || 1.4;
        if (p.won) marketMap[normMarket].won++;
    });
});

// 4. Oran Segment Analizi
const oddsSegments = {
    "Düşük Risk (1.20 - 1.35)": { count: 0, won: 0 },
    "İdeal Denge (1.36 - 1.50)": { count: 0, won: 0 },
    "Değerli Oran (1.51 - 1.80)": { count: 0, won: 0 },
    "Yüksek / Sürpriz (1.81+)": { count: 0, won: 0 }
};

completedCoupons.forEach(c => {
    c.picks.forEach(p => {
        const odd = parseFloat(p.odd) || 1.4;
        let seg = "İdeal Denge (1.36 - 1.50)";
        if (odd <= 1.35) seg = "Düşük Risk (1.20 - 1.35)";
        else if (odd <= 1.50) seg = "İdeal Denge (1.36 - 1.50)";
        else if (odd <= 1.80) seg = "Değerli Oran (1.51 - 1.80)";
        else seg = "Yüksek / Sürpriz (1.81+)";

        oddsSegments[seg].count++;
        if (p.won) oddsSegments[seg].won++;
    });
});

// 5. Seans Analizi
const sessionMap = {};
completedCoupons.forEach(c => {
    const s = c.sessionName || "Diğer";
    if (!sessionMap[s]) sessionMap[s] = { count: 0, won: 0, net: 0, stake: 0, ret: 0 };
    sessionMap[s].count++;
    sessionMap[s].stake += c.stake;
    if (c.status.includes("Kazandı")) {
        sessionMap[s].won++;
        const ret = c.stake * c.totalOdd;
        sessionMap[s].ret += ret;
        sessionMap[s].net += (ret - c.stake);
    } else {
        sessionMap[s].net -= c.stake;
    }
});

console.log(JSON.stringify({
    categoryMap,
    marketMap,
    oddsSegments,
    sessionMap,
    todayCoupons: c13.map(c => ({
        num: c.couponNumber,
        title: c.title,
        badge: c.badge,
        odd: c.totalOdd,
        session: c.sessionName,
        picks: c.picks.map(p => ({
            time: p.timeStr,
            match: `${p.homeTeam} - ${p.awayTeam}`,
            league: p.league,
            pick: p.pickTitle,
            odd: p.odd,
            confidence: p.confidence,
            review: p.siteReview,
            rating: p.matchRating
        }))
    }))
}, null, 2));

