import { validateThxList } from "./models"
import { setEmojiUrls } from "./emoji"
declare var process: any
const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async (): Promise<Thx[]> => {
    const resp = await fetch(`${API_URI}/thanks/list`)
    const res = await validateThxList(await resp.json())
    return res.type === "Ok" ? setEmojiUrls(res.value) : []
}
