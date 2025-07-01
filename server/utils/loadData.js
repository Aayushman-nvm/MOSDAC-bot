import fs from "fs";
import path from "path";

export function loadAllMosdacData() {
  const missionsDir = path.join("crawler", "data", "missions");
  const mosdacDir = path.join("crawler", "data");

  const dataStore = {};

  // Load missions
  const missionFiles = fs
    .readdirSync(missionsDir)
    .filter((f) => f.endsWith(".json"));
  for (const file of missionFiles) {
    const content = fs.readFileSync(path.join(missionsDir, file), "utf-8");
    const json = JSON.parse(content);
    const key = file.replace(".json", "");
    dataStore[key] = json;
  }

  // Load mosdac_*.json files
  const mosdacFiles = fs
    .readdirSync(mosdacDir)
    .filter((f) => f.startsWith("mosdac_") && f.endsWith(".json"));
  for (const file of mosdacFiles) {
    const content = fs.readFileSync(path.join(mosdacDir, file), "utf-8");
    const json = JSON.parse(content);
    const key = file.replace(".json", "");
    dataStore[key] = json;
  }

  return dataStore;
}
