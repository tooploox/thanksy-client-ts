import { validateThxList } from "./models"
import { setEmojiUrls } from "./emoji"
import { request, HTTPError } from "./utils/https"

// const API_URI = "http://localhost:3000"
const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async (bearer: string) => {
    const url = `${API_URI}/thanks/list`
    try {
        const json = await request(url, null, bearer, "GET")
        const res = await validateThxList(json)
        return res.type === "Ok" ? setEmojiUrls(res.value.slice(0, 20)) : []
    } catch (err) {
        const { name } = err as HTTPError
        if (name === "ServerError") throw new Error("InvalidToken" as ApiState)
        throw new Error("NoResponse" as ApiState)
    }
}
