import { validateThxList } from "./models"

const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async () => {
    const resp = await fetch(`${API_URI}/thanks/list`)
    const res = validateThxList(await resp.json())
    return res.type === "Ok" ? res.value : []
}
