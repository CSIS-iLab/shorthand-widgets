import { csv } from "d3-fetch"

export async function getData(URL) {
  if (!URL) throw new Error("Missing data URL")
  
  const res = await csv(URL)

  const data = res
    .map( (row, index) => {
      return {
        id: index,
        image: row.image?.trim(),
        sourceText: row.source_text?.trim(),
        link: row.link?.trim()
      }
    })

  return data
}
