import { validateThxList } from "./models"
import { setEmojiUrls } from "./emoji"
import { get } from "./utils/https"
declare var process: any
const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async (): Promise<Thx[]> => {
    const url = `${API_URI}/thanks/list`
    const json = await get(url)
    const res = await validateThxList(json)
    return res.type === "Ok" ? setEmojiUrls(res.value.slice(0, 15)) : []
}
