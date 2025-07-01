import { chromium } from "playwright";
import fs from "fs";

export async function scrapeFAQ() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  const url = "https://www.mosdac.gov.in/faq-page";
  await page.goto(url, { waitUntil: "networkidle" });

  await page.waitForSelector(".faq-question-answer", { state: "attached" });

  const faqs = await page.$$eval(".faq-question-answer", (faqElements) => {
    return faqElements
      .map((faqEl) => {
        const questionEl = faqEl.querySelector(".faq-question a");
        const answerEl = faqEl.querySelector(".faq-answer");
        const question = questionEl ? questionEl.innerText.trim() : "";
        const answer = answerEl ? answerEl.innerText.trim() : "";
        return { question, answer };
      })
      .filter((faq) => faq.question && faq.answer);
  });

  const data = { url, type: "faq", faqs };

  fs.writeFileSync("./data/mosdac_faq.json", JSON.stringify(data, null, 2));
  console.log("✅ FAQ data saved to ../data/mosdac_faq.json");

  await browser.close();
}
