import { validateThxList, setEmojiUrls } from "./models"
declare var process: any
const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async (): Promise<Thx[]> => {
    const resp = await fetch(`${API_URI}/thanks/list`)
    const res = await validateThxList(await resp.json())
    if (res.type === "Err") return []

    return Promise.all(
        res.value.map(async thx => ({
            ...thx,
            chunks: await setEmojiUrls(thx.chunks)
        }))
    )
}
