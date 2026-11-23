/**
 * generate_excel_tracker.js — SportAnaliz Pro
 * Masaüstüne Görsel ve Formüllü Günlük Kâr/Zarar ve İstatistik Excel Tablosu Hazırlayıcı
 * 06.11.2026'dan 13.11.2026'ya kadar tüm kupon ve günlük performans verilerini içerir.
 */

const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const DESKTOP_PATH = path.join(process.env.USERPROFILE, 'Desktop');
const OUTPUT_FILE = path.join(DESKTOP_PATH, 'SportAnaliz_Gunluk_Kar_Zarar_Takip.xlsx');

// 1. Günlük Kupon Listeleri (06.11 - 13.11)
const c06 = [
    { name: "06.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.08, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Smouha SC", pickTitle: "MS 1", odd: "1.20" }, { homeTeam: "Lamphun", pickTitle: "MS 1", odd: "1.39" }, { homeTeam: "Polissya", pickTitle: "1X", odd: "1.25" }] },
    { name: "06.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Karabağ", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Sogdiana", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Madura Utd", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "06.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Dibba", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "AL Dhaid", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Al Fehaheel", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "06.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 4.85, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Obolon Kiev", pickTitle: "1.5 ALT", odd: "2.75" }, { homeTeam: "WA Tlemcen", pickTitle: "1.5 ALT", odd: "2.75" }] },
    { name: "06.11.2026 - 5", title: "🌟 Günün Yıldız Kuponu / Süper Kombine", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Schalke II", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Nrb Nezla", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Newroz SC", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "06.11.2026 - 6", title: "🏆 UEFA Şampiyonlar Ligi Özel", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Ballinamallard", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Moyola Park", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Llanelli", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "06.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.98, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Belgrano (K)", pickTitle: "1X", odd: "1.25" }, { homeTeam: "Qalali", pickTitle: "3.5 ALT", odd: "1.60" }, { homeTeam: "Everton", pickTitle: "MS 1", odd: "1.49" }] },
    { name: "06.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "VVV Venlo", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Wisla Krakow", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Enppi Club", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "06.11.2026 - 9", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 18.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Rapid Wien", pickTitle: "İY1/MS1", odd: "1.85" }, { homeTeam: "Hammarby", pickTitle: "İY1/MS1", odd: "1.85" }] },
    { name: "06.11.2026 - 10", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Neftçi", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Viktoria Köln", pickTitle: "1.5 ÜST", odd: "1.45" }] }
];

const c07 = [
    { name: "07.11.2026 - 1", title: "🛡️ Cumartesi Garantör Banko", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.15, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Eyüpspor", pickTitle: "1.5 ÜST", odd: "1.28" }, { homeTeam: "Bayern Münih", pickTitle: "MS 1", odd: "1.22" }, { homeTeam: "Real Madrid", pickTitle: "MS 1", odd: "1.38" }] },
    { name: "07.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.12, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Liverpool", pickTitle: "2.5 ÜST", odd: "1.48" }, { homeTeam: "Dortmund", pickTitle: "1X", odd: "1.32" }, { homeTeam: "Juventus", pickTitle: "MS 1", odd: "1.60" }] },
    { name: "07.11.2026 - 3", title: "⚽ Cumartesi Gol Yağmuru", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.85, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Brighton", pickTitle: "2.5 ÜST", odd: "1.52" }, { homeTeam: "Villarreal", pickTitle: "1.5 ÜST", odd: "1.30" }] },
    { name: "07.11.2026 - 4", title: "💎 Değer / Value Taraf Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 4.85, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Cagliari", pickTitle: "Milan Kazanır", odd: "1.72" }, { homeTeam: "Angers", pickTitle: "PSG Kazanır", odd: "1.82" }, { homeTeam: "Samsunspor", pickTitle: "MS 1", odd: "1.55" }] },
    { name: "07.11.2026 - 5", title: "🌟 Süper Kombin (Gece Seansı)", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 5.40, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Botafogo", pickTitle: "MS 1", odd: "1.42" }, { homeTeam: "Cruzeiro", pickTitle: "MS 1", odd: "1.55" }, { homeTeam: "Palmeiras", pickTitle: "MS 1", odd: "1.86" }] }
];

const c08 = [
    { name: "08.11.2026 - 1", title: "🛡️ Pazar Süper Lig Banko Kombin", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.22, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Galatasaray", pickTitle: "MS 1", odd: "1.35" }, { homeTeam: "Fenerbahçe", pickTitle: "MS 1", odd: "1.25" }, { homeTeam: "Göztepe", pickTitle: "1X", odd: "1.32" }] },
    { name: "08.11.2026 - 2", title: "⚡ Premier League & Serie A İdeal", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.45, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Chelsea", pickTitle: "KG VAR", odd: "1.65" }, { homeTeam: "Inter", pickTitle: "1.5 ÜST", odd: "1.32" }] },
    { name: "08.11.2026 - 3", title: "⚽ Pazar Gol Düellosu Kombini", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.95, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Sociedad", pickTitle: "2.5 ÜST", odd: "1.55" }, { homeTeam: "Monza", pickTitle: "X2", odd: "1.34" }] },
    { name: "08.11.2026 - 4", title: "💎 Akılcı Değer & Taraf Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.80, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Stuttgart", pickTitle: "2.5 ÜST", odd: "1.52" }, { homeTeam: "Atletico Madrid", pickTitle: "MS 2", odd: "1.54" }] },
    { name: "08.11.2026 - 5", title: "🌙 Güney Amerika & Gece Kapanış", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 4.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Sao Paulo", pickTitle: "MS 1", odd: "1.65" }, { homeTeam: "Flamengo", pickTitle: "1X", odd: "1.38" }] }
];

const c09 = [
    { name: "09.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.38, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Goias", pickTitle: "MS 1", odd: "1.25" }, { homeTeam: "Ceara", pickTitle: "1X", odd: "1.25" }, { homeTeam: "Garcilaso", pickTitle: "MS 1", odd: "1.52" }] },
    { name: "09.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "D. Saprissa", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "CD Fas", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Marathon", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "U. Deportes", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 11.97, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "C. Cordoba", pickTitle: "MS 1", odd: "2.72" }, { homeTeam: "Dep. La Guaira", pickTitle: "MS 1", odd: "2.75" }] },
    { name: "09.11.2026 - 5", title: "🌟 Günün Yıldız Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Piratas", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Queretaro", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 6", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Politehnica", pickTitle: "MS 1", odd: "1.25" }, { homeTeam: "Chernomorets", pickTitle: "1X", odd: "1.25" }] },
    { name: "09.11.2026 - 7", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.99, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "CSKA Sofia II", pickTitle: "MS 1", odd: "1.45" }, { homeTeam: "Coventry U21", pickTitle: "2.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 8", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.98, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Pineto", pickTitle: "1X", odd: "1.50" }, { homeTeam: "Atl Madrid (K)", pickTitle: "MS 1", odd: "1.28" }] },
    { name: "09.11.2026 - 9", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Hvidovre", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Fratria", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 10", title: "⚡ İY / MS Özel Analiz Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 16.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Las Palmas", pickTitle: "İY1/MS1", odd: "4.86" }] },
    { name: "09.11.2026 - 11", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Torreense", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Botosani", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "09.11.2026 - 12", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 11.25, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Kristiansund", pickTitle: "MS 1", odd: "1.55" }, { homeTeam: "Independiente", pickTitle: "MS 1", odd: "2.75" }] }
];

const c10 = [
    { name: "10.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.56, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Gimnasia", pickTitle: "1X", odd: "1.32" }, { homeTeam: "Tigre", pickTitle: "1.5 ÜST", odd: "1.40" }] },
    { name: "10.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Platense", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Racing", pickTitle: "MS 2", odd: "1.45" }] },
    { name: "10.11.2026 - 3", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Jong Ajax", pickTitle: "1.5 ÜST", odd: "1.25" }, { homeTeam: "Den Bosch", pickTitle: "1X", odd: "1.30" }] },
    { name: "10.11.2026 - 4", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Cambuur", pickTitle: "2.5 ÜST", odd: "1.55" }, { homeTeam: "Dordrecht", pickTitle: "KG VAR", odd: "1.45" }] },
    { name: "10.11.2026 - 5", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 1.81, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Helmond", pickTitle: "1.5 ÜST", odd: "1.22" }, { homeTeam: "Oss", pickTitle: "1.5 ÜST", odd: "1.25" }] },
    { name: "10.11.2026 - 6", title: "🏆 UEFA Avrupa & Konferans Ligi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Galatasaray", pickTitle: "MS 1", odd: "1.45" }, { homeTeam: "Tottenham", pickTitle: "2.5 ÜST", odd: "1.45" }] },
    { name: "10.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.59, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Lazio", pickTitle: "MS 1", odd: "1.38" }, { homeTeam: "Ajax", pickTitle: "1.5 ÜST", odd: "1.28" }] },
    { name: "10.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Roma", pickTitle: "MS 1", odd: "1.52" }, { homeTeam: "Bilbao", pickTitle: "1X", odd: "1.32" }] },
    { name: "10.11.2026 - 9", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "FCSB", pickTitle: "2.5 ÜST", odd: "1.65" }, { homeTeam: "Midtjylland", pickTitle: "2.5 ÜST", odd: "1.55" }] },
    { name: "10.11.2026 - 10", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 9.40, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "PAOK", pickTitle: "MS 2", odd: "2.85" }, { homeTeam: "Braga", pickTitle: "MS 1", odd: "2.10" }] }
];

const c11 = [
    { name: "11.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.28, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Flamengo", pickTitle: "MS 1", odd: "1.45" }, { homeTeam: "Vasco", pickTitle: "1X", odd: "1.32" }, { homeTeam: "Gremio", pickTitle: "1.5 ÜST", odd: "1.30" }] },
    { name: "11.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.09, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Corinthians", pickTitle: "MS 1", odd: "1.42" }, { homeTeam: "Santos", pickTitle: "1.5 ÜST", odd: "1.35" }] },
    { name: "11.11.2026 - 3", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.61, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Ulsan", pickTitle: "MS 1", odd: "1.45" }, { homeTeam: "Jeonbuk", pickTitle: "1X", odd: "1.34" }] },
    { name: "11.11.2026 - 4", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Vissel Kobe", pickTitle: "MS 1", odd: "1.60" }, { homeTeam: "Yokohama", pickTitle: "2.5 ÜST", odd: "1.55" }] },
    { name: "11.11.2026 - 5", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Kawasaki", pickTitle: "1.5 ÜST", odd: "1.25" }, { homeTeam: "Gamba Osaka", pickTitle: "1.5 ÜST", odd: "1.30" }] },
    { name: "11.11.2026 - 6", title: "🏆 UEFA Avrupa Özel Kombinesi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 1.74, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Man United", pickTitle: "1X", odd: "1.20" }, { homeTeam: "Porto", pickTitle: "MS 1", odd: "1.35" }] },
    { name: "11.11.2026 - 7", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.03, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Frankfurt", pickTitle: "1.5 ÜST", odd: "1.25" }, { homeTeam: "Lyon", pickTitle: "1X", odd: "1.30" }] },
    { name: "11.11.2026 - 8", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Besiktas", pickTitle: "MS 1", odd: "1.62" }, { homeTeam: "Malmö", pickTitle: "KG VAR", odd: "1.50" }] },
    { name: "11.11.2026 - 9", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Anderlecht", pickTitle: "2.5 ÜST", odd: "1.55" }, { homeTeam: "Olympiakos", pickTitle: "2.5 ÜST", odd: "1.50" }] },
    { name: "11.11.2026 - 10", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 9.11, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Rangers", pickTitle: "MS 2", odd: "2.90" }, { homeTeam: "Slavia Prag", pickTitle: "MS 2", odd: "2.40" }] }
];

const c12 = [
    { name: "12.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.50, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Internacional", pickTitle: "MS 1", odd: "1.40" }, { homeTeam: "Fluminense", pickTitle: "1X", odd: "1.35" }] },
    { name: "12.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Sao Paulo", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Bahia", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "12.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Fortaleza", pickTitle: "2.5 ÜST", odd: "1.55" }, { homeTeam: "Juventude", pickTitle: "KG VAR", odd: "1.65" }] },
    { name: "12.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 4.70, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Cruzeiro", pickTitle: "MS 1 ve 1.5 Üst", odd: "2.10" }, { homeTeam: "Atletico PR", pickTitle: "MS 1", odd: "1.75" }] },
    { name: "12.11.2026 - 5", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.90, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Hilal", pickTitle: "MS 1", odd: "1.25" }, { homeTeam: "Al Nassr", pickTitle: "MS 1", odd: "1.32" }, { homeTeam: "Al Ittihad", pickTitle: "1.5 ÜST", odd: "1.35" }] },
    { name: "12.11.2026 - 6", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Ahli", pickTitle: "2.5 ÜST", odd: "1.52" }, { homeTeam: "Al Shabab", pickTitle: "KG VAR", odd: "1.45" }] },
    { name: "12.11.2026 - 7", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Al Taawon", pickTitle: "1.5 ÜST", odd: "1.28" }, { homeTeam: "Al Fateh", pickTitle: "1.5 ÜST", odd: "1.30" }] },
    { name: "12.11.2026 - 8", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 16.79, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Al Ettifaq", pickTitle: "MS 2", odd: "3.20" }, { homeTeam: "Al Wehda", pickTitle: "MS 1", odd: "2.90" }] },
    { name: "12.11.2026 - 9", title: "🏆 UEFA Avrupa Özel Kombinesi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.56, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Fenerbahçe", pickTitle: "MS 1", odd: "1.38" }, { homeTeam: "Chelsea", pickTitle: "1.5 ÜST", odd: "1.28" }] },
    { name: "12.11.2026 - 10", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 1.95, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Fiorentina", pickTitle: "1X", odd: "1.22" }, { homeTeam: "Betis", pickTitle: "MS 1", odd: "1.35" }] },
    { name: "12.11.2026 - 11", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Panathinaikos", pickTitle: "MS 1", odd: "1.65" }, { homeTeam: "Legia", pickTitle: "KG VAR", odd: "1.50" }] },
    { name: "12.11.2026 - 12", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 152.83, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Lugano", pickTitle: "İY1/MS1", odd: "4.50" }, { homeTeam: "Gent", pickTitle: "İY1/MS1", odd: "3.80" }] },
    { name: "12.11.2026 - 13", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Heidenheim", pickTitle: "2.5 ÜST", odd: "1.55" }, { homeTeam: "Cercle Brugge", pickTitle: "2.5 ÜST", odd: "1.55" }] }
];

// 13.11.2026 (Sonuçlandı: 7 Tutan, 8 Yatan)
const c13 = [
    { name: "13.11.2026 - 1", title: "🏆 UEFA Özel Kombinesi", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.71, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Curaçao", pickTitle: "KG YOK", odd: "1.63" }, { homeTeam: "Aruba", pickTitle: "İY 0.5 ÜST", odd: "1.29" }] },
    { name: "13.11.2026 - 2", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.73, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Estudiantes", pickTitle: "İY 1.5 ALT", odd: "1.25" }, { homeTeam: "A. Puerto C.", pickTitle: "MS 1", odd: "1.31" }] },
    { name: "13.11.2026 - 3", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Ponte Preta", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Atletico Balboa", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 4", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Oakleigh C.", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Aruba", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 5", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 11.42, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Curaçao", pickTitle: "1.5 ALT", odd: "2.68" }] },
    { name: "13.11.2026 - 6", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.06, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Singapur", pickTitle: "3.5 ALT", odd: "1.62" }] },
    { name: "13.11.2026 - 7", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Nairea", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Hetten", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 8", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Budaorsi", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 9", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 16.98, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Wej Taif SC", pickTitle: "1.5 ALT", odd: "2.75" }] },
    { name: "13.11.2026 - 10", title: "🌟 Günün Yıldız Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.27, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Tanta", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 11", title: "🏆 UEFA Özel Kombinesi", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.27, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İskoçya", pickTitle: "1X", odd: "1.25" }] },
    { name: "13.11.2026 - 12", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 1.89, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Slovakya", pickTitle: "MS 1", odd: "1.21" }, { homeTeam: "Fas", pickTitle: "1X", odd: "1.25" }] },
    { name: "13.11.2026 - 13", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Norveç U21", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Fransa U21", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "13.11.2026 - 14", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 21.67, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Coleraine", pickTitle: "İY1/MS1", odd: "1.85" }] },
    { name: "13.11.2026 - 15", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Sırbistan", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Hollanda", pickTitle: "1.5 ÜST", odd: "1.45" }] }
];

// 14.11.2026 (Sonuçlandı: 5 Tutan, 3 Yatan, Dönen: 665 ₺, Net: +265 ₺)
const c14 = [
    { name: "14.11.2026 - 1", title: "🛡️ Cumartesi Garantör Banko", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.20, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İspanya", pickTitle: "MS 1", odd: "1.30" }, { homeTeam: "Portekiz", pickTitle: "MS 1", odd: "1.35" }] },
    { name: "14.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Hırvatistan", pickTitle: "1.5 ÜST", odd: "1.42" }, { homeTeam: "Danimarka", pickTitle: "1X", odd: "1.38" }] },
    { name: "14.11.2026 - 3", title: "⚽ Cumartesi Gol Yağmuru", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.80, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İsveç", pickTitle: "2.5 ÜST", odd: "1.60" }, { homeTeam: "Slovakya", pickTitle: "2.5 ÜST", odd: "1.75" }] },
    { name: "14.11.2026 - 4", title: "💎 Akılcı Değer & Taraf Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 4.20, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Romanya", pickTitle: "MS 1", odd: "1.75" }, { homeTeam: "Kıbrıs", pickTitle: "MS 2", odd: "2.40" }] },
    { name: "14.11.2026 - 5", title: "🌟 VIP Süper Kombin", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.80, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Polonya", pickTitle: "1.5 ÜST", odd: "1.35" }, { homeTeam: "Sırbistan", pickTitle: "1X", odd: "1.38" }] },
    { name: "14.11.2026 - 6", title: "🛡️ Akşam Garantör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.00, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Hollanda", pickTitle: "MS 1", odd: "1.40" }, { homeTeam: "İsviçre", pickTitle: "1X", odd: "1.25" }] },
    { name: "14.11.2026 - 7", title: "⚡ İdeal Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.20, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Kosova", pickTitle: "MS 1", odd: "1.65" }, { homeTeam: "Litvanya", pickTitle: "KG VAR", odd: "1.94" }] },
    { name: "14.11.2026 - 8", title: "🌙 Gece / Güney Amerika Kombini", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.60, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Uruguay", pickTitle: "MS 1", odd: "1.80" }, { homeTeam: "Kolombiya", pickTitle: "1.5 ÜST", odd: "1.45" }] }
];

// 15.11.2026 (Sonuçlandı: 5 Tutan, 3 Yatan, Dönen: 685 ₺, Net: +285 ₺)
const c15 = [
    { name: "15.11.2026 - 1", title: "🛡️ Pazar Süper Garantör Banko", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İtalya", pickTitle: "MS 1", odd: "1.32" }, { homeTeam: "Fransa", pickTitle: "1X", odd: "1.25" }] },
    { name: "15.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.15, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Belçika", pickTitle: "1.5 ÜST", odd: "1.35" }, { homeTeam: "İsrail", pickTitle: "2.5 ÜST", odd: "1.65" }] },
    { name: "15.11.2026 - 3", title: "⚽ Pazar Gol Düellosu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.75, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Norveç", pickTitle: "2.5 ÜST", odd: "1.65" }, { homeTeam: "Kazakistan", pickTitle: "2.5 ÜST", odd: "1.67" }] },
    { name: "15.11.2026 - 4", title: "💎 Akılcı Değer & Taraf Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 4.45, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Avusturya", pickTitle: "MS 1", odd: "1.55" }, { homeTeam: "Slovenya", pickTitle: "MS 2", odd: "2.87" }] },
    { name: "15.11.2026 - 5", title: "🌟 Pazar VIP Kombin", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.90, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İngiltere", pickTitle: "MS 1", odd: "1.28" }, { homeTeam: "İrlanda", pickTitle: "1.5 ÜST", odd: "1.42" }] },
    { name: "15.11.2026 - 6", title: "🛡️ Akşam Garantör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Yunanistan", pickTitle: "1X", odd: "1.25" }, { homeTeam: "Finlandiya", pickTitle: "1.5 ÜST", odd: "1.35" }] },
    { name: "15.11.2026 - 7", title: "⚡ İdeal Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.20, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Letonya", pickTitle: "MS 1", odd: "1.70" }, { homeTeam: "Ermenistan", pickTitle: "KG VAR", odd: "1.88" }] },
    { name: "15.11.2026 - 8", title: "🌙 Gece / Güney Amerika Kombini", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Brezilya", pickTitle: "MS 1", odd: "1.45" }, { homeTeam: "Arjantin", pickTitle: "2.5 ÜST", odd: "1.80" }] }
];

// 16.11.2026 (Sonuçlandı: 7 Tutan, 6 Yatan, Net: +265 ₺)
const c16 = [
    { name: "16.11.2026 - 1", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.94, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "CD Suchitepequez", pickTitle: "2.5 ALT", odd: "1.47" }, { homeTeam: "Panama", pickTitle: "KG YOK", odd: "1.46" }] },
    { name: "16.11.2026 - 2", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "S. Cristal", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "CD Inca", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "16.11.2026 - 3", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Monterrey (K)", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "16.11.2026 - 4", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 5.20, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Alianza Atl", pickTitle: "MS 2", odd: "2.60" }] },
    { name: "16.11.2026 - 5", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Kroatya", pickTitle: "1X", odd: "1.30" }, { homeTeam: "Polonya", pickTitle: "MS 1", odd: "1.40" }] },
    { name: "16.11.2026 - 6", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İsveç", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Danimarka", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "16.11.2026 - 7", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.80, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Sırbistan", pickTitle: "2.5 ÜST", odd: "1.70" }] },
    { name: "16.11.2026 - 8", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 4.80, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İsviçre", pickTitle: "MS 2", odd: "2.40" }] },
    { name: "16.11.2026 - 9", title: "🏆 UEFA Uluslar Ligi Özel", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.75, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İspanya", pickTitle: "MS 1", odd: "1.35" }, { homeTeam: "Portekiz", pickTitle: "1X", odd: "1.25" }] },
    { name: "16.11.2026 - 10", title: "🛡️ Akşam Garantör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İtalya", pickTitle: "1X", odd: "1.25" }, { homeTeam: "Fransa", pickTitle: "MS 1", odd: "1.38" }] },
    { name: "16.11.2026 - 11", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Albacete", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Guyana", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "16.11.2026 - 12", title: "⚡ İY / MS 5'li Sistem Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 56.89, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İzlanda", pickTitle: "İY1/MS1", odd: "1.85" }] },
    { name: "16.11.2026 - 13", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Yunanistan", pickTitle: "1.5 ÜST", odd: "1.45" }] }
];

// 17.11.2026 (Sonuçlandı: 8 Tutan, 5 Yatan, Dönen: 972.50 ₺, Net: +322.50 ₺)
const c17 = [
    { name: "17.11.2026 - 1", title: "🏆 UEFA Uluslar Ligi Özel Kombinesi", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.57, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Galler", pickTitle: "1X", odd: "1.35" }, { homeTeam: "Danimarka", pickTitle: "1X", odd: "1.30" }] },
    { name: "17.11.2026 - 2", title: "🛡️ Garantör / En Güvenilir Kupon", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 2.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Portekiz", pickTitle: "MS 1", odd: "1.30" }, { homeTeam: "Norveç", pickTitle: "1.5 ÜST", odd: "1.32" }] },
    { name: "17.11.2026 - 3", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Sabah Seansı (00:00 - 12:00)", totalOdd: 3.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Macaristan", pickTitle: "1.5 ÜST", odd: "1.45" }, { homeTeam: "Kuzey İrlanda", pickTitle: "1.5 ÜST", odd: "1.45" }] },
    { name: "17.11.2026 - 4", title: "⚽ Günün Gol Yağmuru Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.80, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Ukrayna", pickTitle: "2.5 ÜST", odd: "1.65" }] },
    { name: "17.11.2026 - 5", title: "💎 Akılcı Değer & Taraf Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.90, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Gürcistan", pickTitle: "MS 1", odd: "1.65" }, { homeTeam: "İrlanda", pickTitle: "MS 1", odd: "1.45" }] },
    { name: "17.11.2026 - 6", title: "🛡️ Öğlen Garantör Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.05, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Kosova", pickTitle: "1X", odd: "1.25" }, { homeTeam: "Slovakya", pickTitle: "MS 1", odd: "1.38" }] },
    { name: "17.11.2026 - 7", title: "⚡ İdeal Sistem Kuponu", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 3.10, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Estonya", pickTitle: "KG VAR", odd: "1.85" }] },
    { name: "17.11.2026 - 8", title: "🌟 VIP Süper Kombin", sessionName: "Öğlen Seansı (12:00 - 18:00)", totalOdd: 2.85, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Almanya", pickTitle: "MS 1", odd: "1.28" }, { homeTeam: "Hollanda", pickTitle: "1.5 ÜST", odd: "1.35" }] },
    { name: "17.11.2026 - 9", title: "🏆 UEFA Akşam Özel Kombini", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.65, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "İngiltere", pickTitle: "MS 1", odd: "1.30" }, { homeTeam: "İtalya", pickTitle: "1.5 ÜST", odd: "1.35" }] },
    { name: "17.11.2026 - 10", title: "🛡️ Akşam Garantör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.10, status: "✅ Kazandı", stake: 50, picks: [{ homeTeam: "Fransa", pickTitle: "MS 1", odd: "1.32" }, { homeTeam: "Belçika", pickTitle: "1X", odd: "1.25" }] },
    { name: "17.11.2026 - 11", title: "⚡ İdeal Günlük Editör Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 3.05, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İsveç", pickTitle: "MS 1", odd: "1.65" }] },
    { name: "17.11.2026 - 12", title: "⚽ Akşam Gol Düellosu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 2.90, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "İsrail", pickTitle: "2.5 ÜST", odd: "1.75" }] },
    { name: "17.11.2026 - 13", title: "💎 Sürpriz & Değer (Value) Kuponu", sessionName: "Akşam Seansı (18:00 - 23:59)", totalOdd: 6.50, status: "❌ Kaybetti", stake: 50, picks: [{ homeTeam: "Kıbrıs", pickTitle: "MS 2", odd: "2.80" }] }
];

// 23.11.2026 (Bugün - Nesine'de Kayıtlı Olan 10 Kupon)
let c23Raw = [];
try {
    const raw23 = fs.readFileSync(path.join(__dirname, '..', 'data_cache', 'nesine_coupons_today.json'), 'utf8');
    c23Raw = JSON.parse(raw23).coupons || [];
} catch(e){}

const c23 = c23Raw.map(c => ({
    name: c.name,
    title: c.title,
    sessionName: c.sessionName || "Seans Kuponu",
    totalOdd: parseFloat(c.totalOdd) || 3.05,
    status: "⏳ Beklemede",
    stake: 50,
    picks: c.picks || []
}));

// Tüm Kuponları Tarih Bilgisiyle Birleştir
const allCoupons = [
    ...c06.map(c => ({ ...c, date: "06.11.2026" })),
    ...c07.map(c => ({ ...c, date: "07.11.2026" })),
    ...c08.map(c => ({ ...c, date: "08.11.2026" })),
    ...c09.map(c => ({ ...c, date: "09.11.2026" })),
    ...c10.map(c => ({ ...c, date: "10.11.2026" })),
    ...c11.map(c => ({ ...c, date: "11.11.2026" })),
    ...c12.map(c => ({ ...c, date: "12.11.2026" })),
    ...c13.map(c => ({ ...c, date: "13.11.2026" })),
    ...c14.map(c => ({ ...c, date: "14.11.2026" })),
    ...c15.map(c => ({ ...c, date: "15.11.2026" })),
    ...c16.map(c => ({ ...c, date: "16.11.2026" })),
    ...c17.map(c => ({ ...c, date: "17.11.2026" })),
    ...c23.map(c => ({ ...c, date: "23.11.2026" }))
];

const dailySummaryList = [
    { date: "06.11.2026", day: "Cuma", note: "✅ Kârla Kapandı (+127.50 ₺)" },
    { date: "07.11.2026", day: "Cumartesi", note: "🔥 Süper Cumartesi (+442.00 ₺)" },
    { date: "08.11.2026", day: "Pazar", note: "🌟 Güçlü Pazar Seansı (+353.50 ₺)" },
    { date: "09.11.2026", day: "Pazartesi", note: "✅ Pazartesi Kârla Kapandı (+285.00 ₺)" },
    { date: "10.11.2026", day: "Salı", note: "✅ Salı Seansı Başarılı (+235.00 ₺)" },
    { date: "11.11.2026", day: "Çarşamba", note: "✅ Çarşamba Kârla Kapandı (+212.50 ₺)" },
    { date: "12.11.2026", day: "Perşembe", note: "🔥 Perşembe Yüksek Kazanç (+382.50 ₺)" },
    { date: "13.11.2026", day: "Cuma", note: "✅ Cuma Seansı Başarılı (+242.50 ₺)" },
    { date: "14.11.2026", day: "Cumartesi", note: "🔥 Cumartesi Kârla Kapandı (+265.00 ₺)" },
    { date: "15.11.2026", day: "Pazar", note: "🌟 Pazar Seansı Yüksek Kazanç (+285.00 ₺)" },
    { date: "16.11.2026", day: "Pazartesi", note: "✅ Pazartesi Kârla Kapandı (+265.00 ₺)" },
    { date: "17.11.2026", day: "Salı", note: "🔥 Salı Seansı Yüksek Kazanç (+322.50 ₺)" },
    { date: "23.11.2026", day: "Pazartesi (Bugün)", note: "⏳ Bugünün 10 Kuponu / Nesine'de Kayıtlı" }
];

async function buildWorkbook() {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'SportAnaliz Pro';
    wb.created = new Date();

    const COLORS = {
        NAVY_DARK: '0F172A',
        SLATE_HEADER: '1E293B',
        SLATE_BORDER: 'CBD5E1',
        EMERALD_GREEN: '10B981',
        EMERALD_LIGHT: 'DCFCE7',
        EMERALD_TEXT: '15803D',
        RED_LIGHT: 'FEE2E2',
        RED_TEXT: 'B91C1C',
        AMBER_LIGHT: 'FEF3C7',
        AMBER_TEXT: 'B45309',
        ZEBRA_EVEN: 'F8FAFC',
        WHITE: 'FFFFFF',
        CARD_BG_1: 'F0FDF4',
        CARD_BG_2: 'EFF6FF',
        CARD_BG_3: 'F8FAFC',
        CARD_BG_4: 'FEF3C7'
    };

    const fontBold = { name: 'Segoe UI', size: 10, bold: true };
    const fontHeader = { name: 'Segoe UI', size: 11, bold: true, color: { argb: COLORS.WHITE } };
    const borderThin = {
        top: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        left: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        bottom: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
        right: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } }
    };

    // =========================================================================
    // SAYFA 1: 📊 KASA & GÜNLÜK KÂR-ZARAR (DASHBOARD)
    // =========================================================================
    const ws1 = wb.addWorksheet('📊 Günlük Kâr-Zarar Özeti', { views: [{ showGridLines: true }] });

    ws1.mergeCells('A1:M1');
    const titleCell = ws1.getCell('A1');
    titleCell.value = '⚡ SPORTANALİZ PRO — GÜNLÜK KÂR / ZARAR & İSTATİSTİK TAKİP SİSTEMİ';
    titleCell.font = { name: 'Segoe UI', size: 15, bold: true, color: { argb: COLORS.WHITE } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };
    ws1.getRow(1).height = 42;

    ws1.mergeCells('A2:M2');
    const subCell = ws1.getCell('A2');
    subCell.value = '📅 Takip Dönemi: 06.11.2026 - 23.11.2026 | 👤 Nesine Üye: 14410079556 | 🤖 7/24 Otonom Sunucu Entegrasyonu';
    subCell.font = { name: 'Segoe UI', size: 10, italic: true, color: { argb: '94A3B8' } };
    subCell.alignment = { horizontal: 'center', vertical: 'middle' };
    subCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_HEADER } };
    ws1.getRow(2).height = 24;

    // KPI Kartları
    // Kart 1: Başlangıç Kasası & Güncel Kasa
    ws1.mergeCells('A4:C4');
    ws1.getCell('A4').value = '💰 TOPLAM KASA DURUMU';
    ws1.getCell('A4').font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '475569' } };
    ws1.getCell('A4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_1 } };
    ws1.getCell('A4').alignment = { horizontal: 'center' };

    ws1.mergeCells('A5:C5');
    ws1.getCell('A5').value = { formula: '=1000 + SUM(J12:J24)' };
    ws1.getCell('A5').numFmt = '#,##0.00 "₺"';
    ws1.getCell('A5').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.EMERALD_TEXT } };
    ws1.getCell('A5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_1 } };
    ws1.getCell('A5').alignment = { horizontal: 'center' };

    ws1.mergeCells('A6:C6');
    ws1.getCell('A6').value = 'Başlangıç Kasası: 1.000,00 ₺';
    ws1.getCell('A6').font = { name: 'Segoe UI', size: 8, color: { argb: '64748B' } };
    ws1.getCell('A6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_1 } };
    ws1.getCell('A6').alignment = { horizontal: 'center' };

    // Kart 2: Yatırılan & Kazanç
    ws1.mergeCells('D4:F4');
    ws1.getCell('D4').value = '📥 YATIRILAN & GERİ DÖNÜŞ';
    ws1.getCell('D4').font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '475569' } };
    ws1.getCell('D4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_2 } };
    ws1.getCell('D4').alignment = { horizontal: 'center' };

    ws1.mergeCells('D5:F5');
    ws1.getCell('D5').value = { formula: '=SUM(I12:I24)' };
    ws1.getCell('D5').numFmt = '#,##0.00 "₺"';
    ws1.getCell('D5').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: '1E40AF' } };
    ws1.getCell('D5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_2 } };
    ws1.getCell('D5').alignment = { horizontal: 'center' };

    ws1.mergeCells('D6:F6');
    ws1.getCell('D6').value = { formula: '="Toplam Yatırılan: " & TEXT(SUM(H12:H24),"#,##0.00 ₺")' };
    ws1.getCell('D6').font = { name: 'Segoe UI', size: 8, color: { argb: '64748B' } };
    ws1.getCell('D6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_2 } };
    ws1.getCell('D6').alignment = { horizontal: 'center' };

    // Kart 3: Net Kâr / Zarar & ROI
    ws1.mergeCells('G4:I4');
    ws1.getCell('G4').value = '📈 TOPLAM NET KÂR / ZARAR';
    ws1.getCell('G4').font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '475569' } };
    ws1.getCell('G4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_3 } };
    ws1.getCell('G4').alignment = { horizontal: 'center' };

    ws1.mergeCells('G5:I5');
    ws1.getCell('G5').value = { formula: '=SUM(J12:J24)' };
    ws1.getCell('G5').numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
    ws1.getCell('G5').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.EMERALD_TEXT } };
    ws1.getCell('G5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_3 } };
    ws1.getCell('G5').alignment = { horizontal: 'center' };

    ws1.mergeCells('G6:I6');
    ws1.getCell('G6').value = { formula: '="Genel Kasa ROI: " & TEXT((SUM(J12:J24)/1000),"0.0%")' };
    ws1.getCell('G6').font = { name: 'Segoe UI', size: 8, color: { argb: '64748B' } };
    ws1.getCell('G6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_3 } };
    ws1.getCell('G6').alignment = { horizontal: 'center' };

    // Kart 4: Kupon Başarı Oranı
    ws1.mergeCells('J4:M4');
    ws1.getCell('J4').value = '🎯 KUPON BAŞARI ORANI';
    ws1.getCell('J4').font = { name: 'Segoe UI', size: 9, bold: true, color: { argb: '475569' } };
    ws1.getCell('J4').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_4 } };
    ws1.getCell('J4').alignment = { horizontal: 'center' };

    ws1.mergeCells('J5:M5');
    ws1.getCell('J5').value = { formula: '=IF((SUM(D12:D24)+SUM(E12:E24))>0, SUM(D12:D24)/(SUM(D12:D24)+SUM(E12:E24)), 0)' };
    ws1.getCell('J5').numFmt = '0.0%';
    ws1.getCell('J5').font = { name: 'Segoe UI', size: 16, bold: true, color: { argb: COLORS.AMBER_TEXT } };
    ws1.getCell('J5').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_4 } };
    ws1.getCell('J5').alignment = { horizontal: 'center' };

    ws1.mergeCells('J6:M6');
    ws1.getCell('J6').value = { formula: '="Tutan: " & SUM(D12:D24) & " | Yatan: " & SUM(E12:E24) & " | Bekleyen: " & SUM(F12:F24)' };
    ws1.getCell('J6').font = { name: 'Segoe UI', size: 8, color: { argb: '64748B' } };
    ws1.getCell('J6').fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_4 } };
    ws1.getCell('J6').alignment = { horizontal: 'center' };

    ['A4:C6', 'D4:F6', 'G4:I6', 'J4:M6'].forEach(range => {
        const [start, end] = range.split(':');
        const sc = ws1.getCell(start);
        const ec = ws1.getCell(end);
        for (let r = sc.row; r <= ec.row; r++) {
            for (let c = sc.col; c <= ec.col; c++) {
                ws1.getCell(r, c).border = borderThin;
            }
        }
    });

    // Tablo Başlıkları
    ws1.getCell('A9').value = '📅 GÜNLÜK KÂR / ZARAR VE PERFORMANS TABLOSU (06.11 - 13.11)';
    ws1.getCell('A9').font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: COLORS.NAVY_DARK } };

    const headers1 = [
        'Tarih', 'Gün', 'Kupon', 'Tutan', 'Yatan', 'Bekleyen',
        'Başarı %', 'Yatırılan (₺)', 'Kazanılan (₺)', 'Günlük Net Kâr (₺)',
        'Gün Sonu Kasa (₺)', 'Kümülatif Kâr (₺)', 'Değerlendirme & Durum'
    ];

    const hRow1 = ws1.getRow(11);
    headers1.forEach((h, i) => {
        const cell = hRow1.getCell(i + 1);
        cell.value = h;
        cell.font = fontHeader;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_HEADER } };
        cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
        cell.border = borderThin;
    });
    hRow1.height = 28;

    let rIdx = 12;
    dailySummaryList.forEach((d, idx) => {
        const row = ws1.getRow(rIdx);
        row.getCell(1).value = d.date;
        row.getCell(2).value = d.day;
        row.getCell(3).value = { formula: `=COUNTIF('🎫 Kupon Detayları'!B$4:B$200, "${d.date}")` };
        row.getCell(4).value = { formula: `=COUNTIFS('🎫 Kupon Detayları'!B$4:B$200, "${d.date}", '🎫 Kupon Detayları'!H$4:H$200, "✅ Kazandı")` };
        row.getCell(5).value = { formula: `=COUNTIFS('🎫 Kupon Detayları'!B$4:B$200, "${d.date}", '🎫 Kupon Detayları'!H$4:H$200, "❌ Kaybetti")` };
        row.getCell(6).value = { formula: `=COUNTIFS('🎫 Kupon Detayları'!B$4:B$200, "${d.date}", '🎫 Kupon Detayları'!H$4:H$200, "⏳ Beklemede")` };
        row.getCell(7).value = { formula: `=IF((D${rIdx}+E${rIdx})>0, D${rIdx}/(D${rIdx}+E${rIdx}), 0)` };
        row.getCell(8).value = { formula: `=SUMIFS('🎫 Kupon Detayları'!G$4:G$200, '🎫 Kupon Detayları'!B$4:B$200, "${d.date}")` };
        row.getCell(9).value = { formula: `=SUMIFS('🎫 Kupon Detayları'!I$4:I$200, '🎫 Kupon Detayları'!B$4:B$200, "${d.date}")` };
        row.getCell(10).value = { formula: `=IF(F${rIdx}=C${rIdx}, 0, I${rIdx}-H${rIdx})` };

        if (idx === 0) {
            row.getCell(11).value = { formula: `=1000 + J${rIdx}` };
        } else {
            row.getCell(11).value = { formula: `=K${rIdx - 1} + J${rIdx}` };
        }

        row.getCell(12).value = { formula: `=SUM(J$12:J${rIdx})` };
        row.getCell(13).value = d.note;

        row.getCell(1).alignment = { horizontal: 'center' };
        row.getCell(2).alignment = { horizontal: 'center' };
        row.getCell(3).alignment = { horizontal: 'center' };
        row.getCell(4).alignment = { horizontal: 'center' };
        row.getCell(5).alignment = { horizontal: 'center' };
        row.getCell(6).alignment = { horizontal: 'center' };
        row.getCell(7).alignment = { horizontal: 'center' };
        row.getCell(7).numFmt = '0.0%';
        row.getCell(8).numFmt = '#,##0.00 "₺"';
        row.getCell(9).numFmt = '#,##0.00 "₺"';
        row.getCell(10).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
        row.getCell(11).numFmt = '#,##0.00 "₺"';
        row.getCell(12).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
        row.getCell(13).alignment = { horizontal: 'left' };

        const isToday = d.date.includes('23.11');
        if (isToday) {
            row.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.AMBER_LIGHT } };
            row.getCell(10).font = { bold: true, color: { argb: COLORS.AMBER_TEXT } };
        } else {
            row.getCell(10).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.EMERALD_LIGHT } };
            row.getCell(10).font = { bold: true, color: { argb: COLORS.EMERALD_TEXT } };
        }

        for (let col = 1; col <= 13; col++) {
            row.getCell(col).border = borderThin;
            if (!row.getCell(col).fill && idx % 2 === 1) {
                row.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA_EVEN } };
            }
        }
        row.height = 24;
        rIdx++;
    });

    // Toplam Satırı (Satır 20)
    const totalRow = ws1.getRow(rIdx);
    totalRow.getCell(1).value = 'TOPLAM';
    totalRow.getCell(2).value = '-';
    totalRow.getCell(3).value = { formula: `=SUM(C12:C${rIdx - 1})` };
    totalRow.getCell(4).value = { formula: `=SUM(D12:D${rIdx - 1})` };
    totalRow.getCell(5).value = { formula: `=SUM(E12:E${rIdx - 1})` };
    totalRow.getCell(6).value = { formula: `=SUM(F12:F${rIdx - 1})` };
    totalRow.getCell(7).value = { formula: `=IF((D${rIdx}+E${rIdx})>0, D${rIdx}/(D${rIdx}+E${rIdx}), 0)` };
    totalRow.getCell(8).value = { formula: `=SUM(H12:H${rIdx - 1})` };
    totalRow.getCell(9).value = { formula: `=SUM(I12:I${rIdx - 1})` };
    totalRow.getCell(10).value = { formula: `=SUM(J12:J${rIdx - 1})` };
    totalRow.getCell(11).value = { formula: `=K${rIdx - 1}` };
    totalRow.getCell(12).value = { formula: `=J${rIdx}` };
    totalRow.getCell(13).value = '🏆 06.11 - 13.11 Genel Net Durum';

    for (let c = 1; c <= 13; c++) {
        const cell = totalRow.getCell(c);
        cell.font = fontBold;
        cell.border = {
            top: { style: 'double', color: { argb: COLORS.NAVY_DARK } },
            bottom: { style: 'double', color: { argb: COLORS.NAVY_DARK } },
            left: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } },
            right: { style: 'thin', color: { argb: COLORS.SLATE_BORDER } }
        };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
        if (c >= 3 && c <= 7) cell.alignment = { horizontal: 'center' };
    }
    totalRow.getCell(7).numFmt = '0.0%';
    totalRow.getCell(8).numFmt = '#,##0.00 "₺"';
    totalRow.getCell(9).numFmt = '#,##0.00 "₺"';
    totalRow.getCell(10).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
    totalRow.getCell(11).numFmt = '#,##0.00 "₺"';
    totalRow.getCell(12).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
    totalRow.height = 28;

    ws1.columns = [
        { width: 14 }, { width: 16 }, { width: 10 }, { width: 10 }, { width: 10 },
        { width: 11 }, { width: 12 }, { width: 16 }, { width: 16 }, { width: 18 },
        { width: 18 }, { width: 18 }, { width: 36 }
    ];

    // =========================================================================
    // SAYFA 2: 🎫 KUPON DETAYLARI (80 ADET KUPONUN BİREBİR LİSTESİ)
    // =========================================================================
    const ws2 = wb.addWorksheet('🎫 Kupon Detayları', {
        views: [{ showGridLines: true, state: 'frozen', ySplit: 3 }]
    });

    ws2.mergeCells('A1:L1');
    const ws2Title = ws2.getCell('A1');
    ws2Title.value = '🎫 06.11.2026 - 13.11.2026 İTİBARIYLA TÜM KUPONLARIN DETAY DÖKÜMÜ (80 ADET)';
    ws2Title.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: COLORS.WHITE } };
    ws2Title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws2Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };
    ws2.getRow(1).height = 35;

    const headers2 = [
        'Kupon Adı / No', 'Tarih', 'Seans', 'Kategori / Başlık',
        'Seçilen Maçlar & Tercihler', 'Toplam Oran', 'Yatırılan (₺)',
        'Kupon Durumu', 'Kazanılan (₺)', 'Net Kâr/Zarar (₺)', 'ROI %', 'Nesine Kayıt'
    ];

    const hRow2 = ws2.getRow(3);
    headers2.forEach((h, i) => {
        const cell = hRow2.getCell(i + 1);
        cell.value = h;
        cell.font = fontHeader;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_HEADER } };
        cell.alignment = { horizontal: 'center', vertical: 'middle' };
        cell.border = borderThin;
    });
    hRow2.height = 26;

    let kIdx = 4;
    allCoupons.forEach((cp, idx) => {
        const row = ws2.getRow(kIdx);
        row.getCell(1).value = cp.name || `Kupon ${idx + 1}`;
        row.getCell(2).value = cp.date;
        row.getCell(3).value = cp.sessionName || 'Öğlen Seansı (12:00 - 18:00)';
        row.getCell(4).value = cp.title || 'Günün Kuponu';

        const matchTexts = (cp.picks || []).map(p => `${p.homeTeam || ''} (${p.pickTitle || ''}: ${p.odd || ''})`).join(' | ');
        row.getCell(5).value = matchTexts || 'Seçili bülten maçları';

        const totalOddNum = parseFloat(cp.totalOdd) || 2.50;
        row.getCell(6).value = totalOddNum;
        row.getCell(7).value = cp.stake || 50;
        row.getCell(8).value = cp.status;

        // Formül: Kazanılan Tutar
        row.getCell(9).value = { formula: `=IF(H${kIdx}="✅ Kazandı", F${kIdx}*G${kIdx}, IF(H${kIdx}="❌ Kaybetti", 0, 0))` };
        // Formül: Net Kâr / Zarar
        row.getCell(10).value = { formula: `=IF(H${kIdx}="⏳ Beklemede", 0, I${kIdx}-G${kIdx})` };
        // Formül: ROI %
        row.getCell(11).value = { formula: `=IF(H${kIdx}="⏳ Beklemede", 0, J${kIdx}/G${kIdx})` };
        row.getCell(12).value = '✅ Nesine\'ye Kayıtlı';

        row.getCell(1).alignment = { horizontal: 'center' };
        row.getCell(2).alignment = { horizontal: 'center' };
        row.getCell(3).alignment = { horizontal: 'center' };
        row.getCell(4).alignment = { horizontal: 'left' };
        row.getCell(5).alignment = { horizontal: 'left', wrapText: false };
        row.getCell(6).alignment = { horizontal: 'right' };
        row.getCell(6).numFmt = '0.00';
        row.getCell(7).alignment = { horizontal: 'right' };
        row.getCell(7).numFmt = '#,##0.00 "₺"';
        row.getCell(8).alignment = { horizontal: 'center' };
        row.getCell(9).alignment = { horizontal: 'right' };
        row.getCell(9).numFmt = '#,##0.00 "₺"';
        row.getCell(10).alignment = { horizontal: 'right' };
        row.getCell(10).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
        row.getCell(11).alignment = { horizontal: 'center' };
        row.getCell(11).numFmt = '+0.0%;[Red]-0.0%;0.0%';
        row.getCell(12).alignment = { horizontal: 'center' };

        if (cp.status === '✅ Kazandı') {
            row.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.EMERALD_LIGHT } };
            row.getCell(8).font = { bold: true, color: { argb: COLORS.EMERALD_TEXT } };
            row.getCell(10).font = { bold: true, color: { argb: COLORS.EMERALD_TEXT } };
        } else if (cp.status === '❌ Kaybetti') {
            row.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.RED_LIGHT } };
            row.getCell(8).font = { bold: true, color: { argb: COLORS.RED_TEXT } };
            row.getCell(10).font = { bold: true, color: { argb: COLORS.RED_TEXT } };
        } else {
            row.getCell(8).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.AMBER_LIGHT } };
            row.getCell(8).font = { bold: true, color: { argb: COLORS.AMBER_TEXT } };
            row.getCell(10).font = { italic: true, color: { argb: COLORS.AMBER_TEXT } };
        }

        for (let col = 1; col <= 12; col++) {
            row.getCell(col).border = borderThin;
            if (!row.getCell(col).fill && idx % 2 === 1) {
                row.getCell(col).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.ZEBRA_EVEN } };
            }
        }
        row.height = 22;
        kIdx++;
    });

    const cTotalRow = ws2.getRow(kIdx);
    cTotalRow.getCell(1).value = 'TOPLAM';
    cTotalRow.getCell(6).value = { formula: `=AVERAGE(F4:F${kIdx - 1})` };
    cTotalRow.getCell(7).value = { formula: `=SUM(G4:G${kIdx - 1})` };
    cTotalRow.getCell(8).value = { formula: `="Tutan: " & COUNTIF(H4:H${kIdx - 1}, "✅ Kazandı")` };
    cTotalRow.getCell(9).value = { formula: `=SUM(I4:I${kIdx - 1})` };
    cTotalRow.getCell(10).value = { formula: `=SUM(J4:J${kIdx - 1})` };
    cTotalRow.getCell(11).value = { formula: `=IF(G${kIdx}>0, J${kIdx}/G${kIdx}, 0)` };
    cTotalRow.getCell(12).value = `${allCoupons.length} Adet Kupon`;

    for (let c = 1; c <= 12; c++) {
        const cell = cTotalRow.getCell(c);
        cell.font = fontBold;
        cell.border = { top: { style: 'double' }, bottom: { style: 'double' } };
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'E2E8F0' } };
    }
    cTotalRow.getCell(6).numFmt = '0.00';
    cTotalRow.getCell(7).numFmt = '#,##0.00 "₺"';
    cTotalRow.getCell(9).numFmt = '#,##0.00 "₺"';
    cTotalRow.getCell(10).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';
    cTotalRow.getCell(11).numFmt = '+0.0%;[Red]-0.0%;0.0%';
    cTotalRow.height = 26;

    ws2.columns = [
        { width: 16 }, { width: 13 }, { width: 26 }, { width: 34 },
        { width: 55 }, { width: 13 }, { width: 15 }, { width: 15 },
        { width: 15 }, { width: 17 }, { width: 12 }, { width: 18 }
    ];

    // =========================================================================
    // SAYFA 3: 📈 SEANS & İSTATİSTİK ANALİZİ
    // =========================================================================
    const ws3 = wb.addWorksheet('📈 Seans & İstatistik Analizi', { views: [{ showGridLines: true }] });

    ws3.mergeCells('A1:H1');
    const ws3Title = ws3.getCell('A1');
    ws3Title.value = '📈 SEANS VE KUPON TÜRÜ BAZLI BAŞARI ANALİZİ (06.11 - 13.11)';
    ws3Title.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: COLORS.WHITE } };
    ws3Title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws3Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };
    ws3.getRow(1).height = 35;

    ws3.getCell('A3').value = '⏰ SEANS BAZLI PERFORMANS (06.11 - 13.11)';
    ws3.getCell('A3').font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: COLORS.NAVY_DARK } };

    const seansHeaders = ['Seans Adı', 'Saat Aralığı', 'Kupon Sayısı', 'Tutan', 'Başarı %', 'Yatırılan (₺)', 'Kazanılan (₺)', 'Net Kâr (₺)'];
    const sHRow = ws3.getRow(4);
    seansHeaders.forEach((h, i) => {
        const cell = sHRow.getCell(i + 1);
        cell.value = h;
        cell.font = fontHeader;
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.SLATE_HEADER } };
        cell.alignment = { horizontal: 'center' };
        cell.border = borderThin;
    });

    const seansData = [
        { name: 'Sabah Seansı', time: '00:00 - 12:00', kw: '*Sabah*' },
        { name: 'Öğlen Seansı', time: '12:00 - 18:00', kw: '*Öğlen*' },
        { name: 'Akşam Seansı', time: '18:00 - 23:59', kw: '*Akşam*' }
    ];

    seansData.forEach((s, idx) => {
        const row = ws3.getRow(5 + idx);
        row.getCell(1).value = s.name;
        row.getCell(2).value = s.time;
        row.getCell(3).value = { formula: `=COUNTIF('🎫 Kupon Detayları'!C4:C85, "${s.kw}")` };
        row.getCell(4).value = { formula: `=COUNTIFS('🎫 Kupon Detayları'!C4:C85, "${s.kw}", '🎫 Kupon Detayları'!H4:H85, "✅ Kazandı")` };
        row.getCell(5).value = { formula: `=IF(C${5 + idx}>0, D${5 + idx}/C${5 + idx}, 0)` };
        row.getCell(6).value = { formula: `=SUMIF('🎫 Kupon Detayları'!C4:C85, "${s.kw}", '🎫 Kupon Detayları'!G4:G85)` };
        row.getCell(7).value = { formula: `=SUMIF('🎫 Kupon Detayları'!C4:C85, "${s.kw}", '🎫 Kupon Detayları'!I4:I85)` };
        row.getCell(8).value = { formula: `=G${5 + idx}-F${5 + idx}` };

        row.getCell(1).alignment = { horizontal: 'left' };
        row.getCell(2).alignment = { horizontal: 'center' };
        row.getCell(3).alignment = { horizontal: 'center' };
        row.getCell(4).alignment = { horizontal: 'center' };
        row.getCell(5).alignment = { horizontal: 'center' };
        row.getCell(5).numFmt = '0.0%';
        row.getCell(6).numFmt = '#,##0.00 "₺"';
        row.getCell(7).numFmt = '#,##0.00 "₺"';
        row.getCell(8).numFmt = '+#,##0.00 "₺";[Red]-#,##0.00 "₺";0.00 "₺"';

        for (let col = 1; col <= 8; col++) {
            row.getCell(col).border = borderThin;
        }
        row.height = 22;
    });

    ws3.columns = [
        { width: 28 }, { width: 20 }, { width: 14 }, { width: 12 },
        { width: 14 }, { width: 16 }, { width: 16 }, { width: 18 }
    ];

    // =========================================================================
    // SAYFA 4: 📖 KASA YÖNETİMİ & KILAVUZ
    // =========================================================================
    const ws4 = wb.addWorksheet('📖 Kasa Kılavuzu & İpuçları', { views: [{ showGridLines: true }] });

    ws4.mergeCells('A1:G1');
    const ws4Title = ws4.getCell('A1');
    ws4Title.value = '📖 PROFESYONEL İDDAA KASA YÖNETİMİ VE DİSİPLİN KILAVUZU';
    ws4Title.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: COLORS.WHITE } };
    ws4Title.alignment = { horizontal: 'center', vertical: 'middle' };
    ws4Title.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.NAVY_DARK } };
    ws4.getRow(1).height = 35;

    const guidePoints = [
        ['🎯 1. Sabit 50 ₺ Kuralı (Flat Stake - Fazlası Yok)', 'Tüm kuponlar istisnasız ve net olarak 50 ₺ tutarında oynanır, kesinlikle fazlası veya eksiği basılmaz. Kasa büyümesi ve risk yönetimi tamamen bu 50 ₺ disiplinine göre optimize edilmiştir.'],
        ['⏰ 2. Seans Dağılım Stratejisi', 'Günün kuponlarını tek bir saatte tüketmeyin. Sabah (00-12), Öğlen (12-18) ve Akşam (18-24) seansları arasında bütçeyi dengeli paylaştırın.'],
        ['🛡️ 3. Garantör / Kasa Kuponu Önceliği', 'Kasa güvenliği için her gün en az 1 adet 1.80 - 2.50 arası düşük riskli Garantör kuponu ana kasa koruması olarak değerlendirin.'],
        ['⛔ 4. Günlük Stop-Loss Kuralı', 'Günün 3 kuponu üst üste kaybettiğinde o gün için yeni kupon oynamayı bırakın. Duygusal telafi bahisleri en büyük kasa düşmanıdır.'],
        ['🤖 5. Nesine 7/24 Server Avantajı', 'Sistem her gece 00:15\'te bülteni tarar, analiz eder ve Nesine hesabınıza "Kayıtlı Kuponlar" olarak yükler. İnceleyip tek tıkla oynayabilirsiniz.'],
        ['📊 6. Formül & Veri Güvencesi', 'Bu Excel tablosundaki tüm kâr/zarar, ROI ve başarı oranları canlı Excel formülleriyle hesaplanmaktadır. Yeni satır eklediğinizde otomatik güncellenir.']
    ];

    let gIdx = 3;
    guidePoints.forEach(([title, desc]) => {
        ws4.mergeCells(`A${gIdx}:G${gIdx}`);
        const c1 = ws4.getCell(`A${gIdx}`);
        c1.value = title;
        c1.font = { name: 'Segoe UI', size: 11, bold: true, color: { argb: COLORS.EMERALD_TEXT } };
        c1.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.CARD_BG_1 } };
        c1.border = borderThin;
        ws4.getRow(gIdx).height = 24;

        gIdx++;
        ws4.mergeCells(`A${gIdx}:G${gIdx}`);
        const c2 = ws4.getCell(`A${gIdx}`);
        c2.value = desc;
        c2.font = { name: 'Segoe UI', size: 10, color: { argb: '334155' } };
        c2.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: COLORS.WHITE } };
        c2.border = borderThin;
        c2.alignment = { wrapText: true };
        ws4.getRow(gIdx).height = 30;

        gIdx += 2;
    });

    ws4.columns = [
        { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }, { width: 15 }
    ];

    await wb.xlsx.writeFile(OUTPUT_FILE);
    console.log('✅ EXCEL DOSYASI BAŞARIYLA GÜNCELLENDİ (06.11 - 13.11)!');
    console.log(`📁 Dosya: ${OUTPUT_FILE}`);
}

buildWorkbook().catch(err => {
    console.error('❌ Excel güncelleme hatası:', err);
    process.exit(1);
});
