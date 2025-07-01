export function getRelevantMosdacContent(userQuery, dataStore) {
  userQuery = userQuery.toLowerCase();
  let foundContent = "";

  for (const [key, data] of Object.entries(dataStore)) {
    if (
      userQuery.includes(key.replace("mosdac_", "").toLowerCase()) ||
      userQuery.includes(key.toLowerCase())
    ) {
      if (data.subPages && Array.isArray(data.subPages)) {
        for (const sub of data.subPages) {
          if (sub.title && userQuery.includes(sub.title.toLowerCase())) {
            foundContent += `Title: ${sub.title}\n${stripHtml(
              sub.content
            )}\n\n`;
          }
        }
      }
      // fallback if no specific subpage matched
      if (!foundContent && data.subPages) {
        foundContent += data.subPages
          .slice(0, 5)
          .map((sub) => {
            return `Title: ${sub.title}\n${stripHtml(sub.content)}\n\n`;
          })
          .join("");
      }
    }
  }

  return foundContent || null;
}

function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
