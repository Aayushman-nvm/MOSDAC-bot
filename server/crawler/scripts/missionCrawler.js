import { chromium } from "playwright";
import fs from "fs";
import path from "path";

export async function scrapeMissions() {
  const missions = [
    { url: "https://www.mosdac.gov.in/insat-3dr", name: "insat-3dr" },
    { url: "https://www.mosdac.gov.in/insat-3d", name: "insat-3d" },
    { url: "https://www.mosdac.gov.in/kalpana-1", name: "kalpana-1" },
    { url: "https://www.mosdac.gov.in/insat-3a", name: "insat-3a" },
    {
      url: "https://www.mosdac.gov.in/megha-tropiques",
      name: "megha-tropiques",
    },
    { url: "https://www.mosdac.gov.in/saral-altika", name: "saral-altika" },
    { url: "https://www.mosdac.gov.in/oceansat-2", name: "oceansat-2" },
    { url: "https://www.mosdac.gov.in/oceansat-3", name: "oceansat-3" },
    { url: "https://www.mosdac.gov.in/insat-3ds", name: "insat-3ds" },
    { url: "https://www.mosdac.gov.in/scatsat-1", name: "scatsat-1" },
  ];

  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  for (const mission of missions) {
    try {
      console.log(`\n🚀 Starting ${mission.name}`);
      await page.goto(mission.url, { waitUntil: "networkidle" });
      await page.waitForTimeout(1000);

      const missionTitle = await page.$eval("#page-title", (el) =>
        el.textContent.trim()
      );

      // Extract nav links
      const navLinks = await page.$$eval("nav.block-menu a", (links) =>
        links
          .map((link) => ({
            url: link.href,
            title: link.textContent.trim(),
          }))
          .filter((l) => l.url && !l.url.endsWith("#"))
      );

      console.log(`🔹 Found ${navLinks.length} subpages.`);

      const missionUrlParsed = new URL(mission.url);
      const subPages = [];

      for (const link of navLinks) {
        const linkUrlParsed = new URL(link.url, mission.url);

        // Check if link belongs to the same domain and is under the same mission
        if (
          linkUrlParsed.hostname === missionUrlParsed.hostname &&
          linkUrlParsed.pathname.startsWith(missionUrlParsed.pathname)
        ) {
          console.log(`🕸️ Scraping: ${link.title}`);

          await page.goto(link.url, { waitUntil: "domcontentloaded" });
          await page.waitForTimeout(1000);

          const content = await page
            .$eval('div.field-item[property="content:encoded"]', (el) =>
              el.innerHTML.trim()
            )
            .catch(() => "No content found.");

          subPages.push({
            title: link.title,
            url: link.url,
            content,
          });

          // Stop if this is the documents page
          if (link.title.toLowerCase().includes("document")) {
            console.log(
              `📄 Documents page reached for ${mission.name}, moving to next mission.`
            );
            break;
          }

          await page.waitForTimeout(500);
        } else {
          console.log(`⚠️ Skipping ${link.title} - not under ${mission.name}`);
        }
      }

      const result = {
        mission: missionTitle,
        baseUrl: mission.url,
        subPages,
      };

      const dir = "./data/missions";
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const filePath = path.join(dir, `${mission.name}.json`);
      fs.writeFileSync(filePath, JSON.stringify(result, null, 2));
      console.log(`✅ Saved ${mission.name} data to ${filePath}`);
    } catch (err) {
      console.error(`❌ Failed to scrape ${mission.name}:`, err);
    }
  }

  await browser.close();
}
