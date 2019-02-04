import { convert } from "./converter"
const API_URI = process.env.API_URL || "https://thanksy.herokuapp.com"

export const loadFeed = async () => {
    const resp = await fetch(`${API_URI}/thanks/list`)
    const thxs = await resp.json()
    return thxs
        .map(convert)
        .filter((v: Maybe<ThxEntry>) => v.type === "some")
        .map((v: any) => v.value)
}
