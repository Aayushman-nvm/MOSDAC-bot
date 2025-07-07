export function getRelevantMosdacContent(userQuery, dataStore) {
  userQuery = userQuery.toLowerCase();
  console.log("USER QUERY:", userQuery);
  let foundContent = "";

  for (const [key, data] of Object.entries(dataStore)) {
    console.log(`CHECKING KEY: ${key}`);

    // key matching with user query for data retrieval
    if (
      userQuery.includes(key.replace("mosdac_", "").toLowerCase()) ||
      userQuery.includes(key.toLowerCase())
    ) {
      console.log("MATCHED CATEGORY:", key);

      // if mission has sub pages... go seaarch deeper into it
      if (data.subPages && Array.isArray(data.subPages)) {
        console.log("PROCESSING SUBPAGES...");
        for (const sub of data.subPages) {
          if (sub.title && userQuery.includes(sub.title.toLowerCase())) {
            foundContent += `Title: ${sub.title}\n${stripHtml(
              sub.content || ""
            )}\n\n`;
          }
        }
        if (!foundContent) {
          foundContent += data.subPages
            .slice(0, 3)
            .map(
              (sub) =>
                `Title: ${sub.title}\n${stripHtml(sub.content || "")}\n\n`
            )
            .join("");
        }
      }

      // if mission doesnt have subpages, take its ,mission title and url
      else if (data.mission && typeof data.mission === "string") {
        if (userQuery.includes(data.mission.toLowerCase())) {
          foundContent += `Mission: ${data.mission}\nBase URL: ${data.baseUrl}\n\n`;
        }
      }

      // handling faq manually
      else if (data.faqs && Array.isArray(data.faqs)) {
        console.log("PROCESSING FAQS...");
        for (const faq of data.faqs) {
          if (faq.question && userQuery.includes(faq.question.toLowerCase())) {
            foundContent += `Q: ${faq.question}\nA: ${stripHtml(
              faq.answer || ""
            )}\n\n`;
          }
        }
        if (!foundContent) {
          foundContent += data.faqs
            .slice(0, 5)
            .map(
              (faq) =>
                `Q: ${faq.question}\nA: ${stripHtml(faq.answer || "")}\n\n`
            )
            .join("");
        }
      }

      // if type of data is catalog then run the condition based on its data structure and format
      else if (Array.isArray(data)) {
        console.log("PROCESSING CATALOG ARRAY...");
        for (const item of data) {
          const combinedString = JSON.stringify(item).toLowerCase();
          if (
            userQuery.split(" ").some((word) => combinedString.includes(word))
          ) {
            foundContent += `Matched Item:\n${JSON.stringify(
              item,
              null,
              2
            )}\n\n`;
          }
        }
        if (!foundContent) {
          foundContent += data
            .slice(0, 3)
            .map(
              (item) => `Item Preview:\n${JSON.stringify(item, null, 2)}\n\n`
            )
            .join("");
        }
      }

      // if structure of data is random...
      else {
        foundContent += `Data Preview:\n${JSON.stringify(data, null, 2).slice(
          0,
          1500
        )}\n\n`;
      }
    }
  }

  console.log("FOUND CONTENT:", foundContent.slice(0, 500));
  return foundContent || null;
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
