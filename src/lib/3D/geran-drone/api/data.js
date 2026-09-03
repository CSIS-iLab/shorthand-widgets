import { csv } from "d3-fetch"

export async function getData(timelineURL, sourcesURL) {
  if (!timelineURL || !sourcesURL) throw new Error("Missing data URLs")

  const [timelineData, sourcesData] = await Promise.all([
    csv(timelineURL),
    csv(sourcesURL),
  ])

  // Build sources lookup by image path — same as vanilla JS
  const sourcesMap = {}
  sourcesData.forEach((item) => {
    if (item.image) {
      sourcesMap[item.image.trim()] = {
        sourceText: item.source_text?.trim() ?? "",
        link: item.link?.trim() ?? "",
      }
    }
  })

  // Merge timeline with sources
  return timelineData.map((item) => ({
    category: item.category?.trim(),
    subCategory: item.subCategory?.trim() ?? "",
    year: item.year?.trim() ?? "",
    description: item.description?.trim(),
    images: (item.images ?? "")
      .split("|")
      .map((imgPath) => {
        const src = imgPath.trim()
        const match = sourcesMap[src]
        return {
          src,
          sourceText: match?.sourceText ?? "",
          link: match?.link ?? "",
        }
      })
      .filter((img) => img.src && img.sourceText !== "REMOVE"),
  }))
}
