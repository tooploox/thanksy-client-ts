import { validateThxList } from "./models"
import { setEmojiUrls } from "./emoji"
import { request } from "./utils/https"
declare var process: any
const API_URI = process.env.API_URL
export const loadFeed = async () => {
    const url = `${API_URI}/thanks/list`
    const json = await request(url, null, "1234562", "GET")
    const res = await validateThxList(json)
    return res.type === "Ok" ? setEmojiUrls(res.value.slice(0, 15)) : []
}
