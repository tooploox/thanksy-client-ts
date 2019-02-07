import { DateTime } from "luxon"
import { isString, isArray, isNumber } from "./utils/converter"
import { parseText } from "./emoji"

export const Err = <T>(error: T): Err<T> => ({ type: "Err", error })
export const Ok = <T>(value: T): Ok<T> => ({ type: "Ok", value })

export const validateThxList = (d: any): Result<Thx[], string> => {
    if (!isArray(d)) return Err("Invalid payload - array expected")
    const thxs = d.map(validateThx)
    const invalidThx: Err<string> | null = thxs.find(t => t.type === "Err") as any
    if (invalidThx) return invalidThx
    return Ok(thxs.map((v: Ok<Thx>) => v.value))
}

export const validateThx = (data: any): Result<Thx, string> => {
    const t: ServerThx = data
    if (!t) return Err("Empty data")
    if (!isArray(t.receivers)) return Err("Invalid receivers")
    const maybeReceivers = t.receivers.map(validateUser)
    if (maybeReceivers.some(r => r.type === "Err")) return Err("Invalid receivers")
    const giver = validateUser(t.giver)
    if (giver.type === "Err") return Err(giver.error)
    if (
        !isNumber(t.id) ||
        !isNumber(t.clap_count) ||
        !isNumber(t.confetti_count) ||
        !isNumber(t.love_count) ||
        !isNumber(t.wow_count)
    )
        return Err("Invalid number " + JSON.stringify(t))
    if (!isString(t.text) || !isString(t.created_at)) return Err("Invalid string " + JSON.stringify(t))
    const d = DateTime.fromISO(t.created_at)
    const createdAt = `${d.toRelativeCalendar()} at ${d.toLocaleString(DateTime.TIME_SIMPLE)}`
    const value: Thx = {
        receivers: maybeReceivers.map((v: Ok<User>) => v.value),
        giver: giver.value,
        chunks: parseText(t.text),
        id: t.id,
        clapCount: t.clap_count,
        confettiCount: t.confetti_count,
        wowCount: t.wow_count,
        loveCount: t.love_count,
        createdAt
    }
    return Ok(value)
}

export const validateUser = (data: any): Result<User, string> => {
    const u: User = data
    if (!u) return Err("Empty data")
    if (!isString(u.id) || !isString(u.real_name) || !isString(u.name) || !isString(u.avatar_url))
        return Err("Invalid data " + JSON.stringify(data))
    const value: User = { id: u.id, real_name: u.real_name, avatar_url: u.avatar_url, name: u.name }
    return Ok(value)
}
