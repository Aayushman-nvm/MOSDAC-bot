import { scrapeFAQ } from "./scripts/faqCrawler.js";
import { scrapeSatelliteCatalog } from "./scripts/satelliteCrawler.js";
import { scrapeInsituCatalog } from "./scripts/insituCrawler.js";
import { scrapeRadarCatalog } from "./scripts/radarCrawler.js";
import { scrapeMissions } from "./scripts/missionCrawler.js";

(async () => {
  console.log("🚀 Starting all MOSDAC crawlers...");

  try {
    await scrapeFAQ();
    console.log("✅ FAQ crawler completed.");
  } catch (err) {
    console.error("❌ FAQ crawler failed:", err);
  }

  try {
    await scrapeSatelliteCatalog();
    console.log("✅ Satellite catalog crawler completed.");
  } catch (err) {
    console.error("❌ Satellite catalog crawler failed:", err);
  }

  try {
    await scrapeInsituCatalog();
    console.log("✅ In-Situ catalog crawler completed.");
  } catch (err) {
    console.error("❌ In-Situ catalog crawler failed:", err);
  }

  try {
    await scrapeRadarCatalog();
    console.log("✅ Radar catalog crawler completed.");
  } catch (err) {
    console.error("❌ Radar catalog crawler failed:", err);
  }

  try {
    await scrapeMissions();
    console.log("✅ Mission crawler completed.");
  } catch (err) {
    console.error("❌ Mission crawler failed:", err);
  }

  console.log("🏁 All crawlers completed.");
})();
