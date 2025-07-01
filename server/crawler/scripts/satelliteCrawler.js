import { chromium } from "playwright";
import fs from "fs";

export async function scrapeSatelliteCatalog() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const url = "https://www.mosdac.gov.in/catalog/satellite.php";
  await page.goto(url, { waitUntil: "networkidle" });

  const data = [];

  const satelliteOptions = await page.$$eval(
    'select[name="satellite"] option',
    (options) =>
      options
        .map((option) => ({
          value: option.value,
          label: option.textContent.trim(),
        }))
        .filter((opt) => opt.value !== "")
  );

  for (const satellite of satelliteOptions) {
    await page.selectOption('select[name="satellite"]', satellite.value);
    await page.waitForTimeout(2000);

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
      await page.selectOption('select[name="sensor"]', sensor.value);
      await page.waitForTimeout(3000);

      const tableExists = (await page.$("#tabledata tbody tr")) !== null;
      if (!tableExists) continue;

      const tableData = await page.$$eval("#tabledata tr", (rows) => {
        return rows.map((row) => {
          const cells = row.querySelectorAll("th, td");
          return Array.from(cells).map((cell) => cell.textContent.trim());
        });
      });

      if (tableData.length > 0) {
        data.push({
          satellite: satellite.label,
          sensor: sensor.label,
          table: tableData,
        });
      }
    }
  }

  fs.writeFileSync(
    "./data/mosdac_satellite_catalog.json",
    JSON.stringify(data, null, 2)
  );
  console.log(
    "✅ Satellite catalog data saved to ../data/mosdac_satellite_catalog.json"
  );

  await browser.close();
}
