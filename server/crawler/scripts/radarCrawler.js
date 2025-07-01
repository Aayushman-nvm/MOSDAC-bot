import { chromium } from "playwright";
import fs from "fs";

export async function scrapeRadarCatalog() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const url = "https://www.mosdac.gov.in/catalog/radar.php";
  await page.goto(url, { waitUntil: "networkidle" });

  const data = [];

  // Select the only satellite (RADAR)
  const satelliteValue = await page.$eval(
    'select[name="satellite"] option',
    (opt) => opt.value
  );
  await page.selectOption('select[name="satellite"]', satelliteValue);
  await page.waitForTimeout(2000);

  // Extract all sensor options
  const sensorOptions = await page.$$eval(
    'select[name="sensor"] option',
    (options) =>
      options
        .map((option) => ({
          value: option.value,
          label: option.textContent.trim(),
        }))
        .filter((opt) => opt.value !== "")
  );

  for (const sensor of sensorOptions) {
    console.log(`Selecting sensor: ${sensor.label}`);
    await page.selectOption('select[name="sensor"]', sensor.value);
    await page.waitForTimeout(3000);

    const tableExists = (await page.$("#tabledata tbody tr")) !== null;
    if (!tableExists) {
      console.log(`  Skipped: No table for ${sensor.label}`);
      continue;
    }

    const tableData = await page.$$eval("#tabledata tbody tr", (rows) => {
      return rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return Array.from(cells).map((cell) => cell.textContent.trim());
      });
    });

    if (tableData.length > 0) {
      console.log(`  Scraped ${tableData.length} rows for ${sensor.label}`);
      data.push({
        sensor: sensor.label,
        table: tableData,
      });
    }
  }

  fs.writeFileSync(
    "./data/mosdac_radar_catalog.json",
    JSON.stringify(data, null, 2)
  );
  console.log("✅ Radar catalog data saved to /data/mosdac_radar_catalog.json");

  await browser.close();
}
