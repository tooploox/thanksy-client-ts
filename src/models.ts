import { isString, isArray, isNumber } from "./utils/converter"
import * as moment from "moment"

export const Text = (caption: string): TextChunk => ({ type: "text", caption })
export const Nickname = (caption: string): TextChunk => ({ type: "nickname", caption })
export const Emoji = (url: string | null, caption: string): TextChunk => ({ type: "emoji", caption, url })

export const parseText = (text: string, acc: TextChunk[] = []): TextChunk[] => {
    if (!text || !text.length) return acc
    const emojiRes = /(:[a-zA-Z_0-9+-]+:)/g.exec(text)
    const emojiIndex = emojiRes ? text.indexOf(emojiRes[0]) : -1

    const nicknameRes = /(@[a-zA-Z_0-9.-]+)/g.exec(text)
    const nicknameIndex = nicknameRes ? text.indexOf(nicknameRes[0]) : -1

    if (emojiRes && (emojiIndex < nicknameIndex || nicknameIndex === -1)) {
        if (emojiIndex !== 0) acc.push(Text(text.substr(0, emojiIndex)))
        acc.push(Emoji("url", emojiRes[0]))
        return parseText(text.substring(emojiIndex + emojiRes[0].length), acc)
    }

    if (nicknameRes && (nicknameIndex < emojiIndex || emojiIndex === -1)) {
        if (nicknameIndex !== 0) acc.push(Text(text.substr(0, nicknameIndex)))
        acc.push(Nickname(nicknameRes[0]))
        return parseText(text.substring(nicknameIndex + nicknameRes[0].length), acc)
    }
    return [...acc, Text(text)]
}

// TODO: get url on text parse result using twemoji.parse's callback
export const Err = <T>(error: T): Err<T> => ({ type: "Err", error })
export const Ok = <T>(value: T): Ok<T> => ({ type: "Ok", value })
export const Nothing = (): Nothing => ({ type: "nothing" })

export const validateThxList = (d: any): Result<Thx[], string> => {
    if (!isArray(d)) return Err("Invalid payload - array expected")
    const thxs = d.map(validateThx)
    const invalidThx: Err<string> | null = thxs.find(t => t.type === "Err") as any
    if (invalidThx) return invalidThx
    return Ok(thxs.map((v: Ok<Thx>) => v.value))
}

declare var require: any
const emojilib = require("emojilib")
const twemoji = require("twemoji").default

const replaceEmoji = (word: string) => {
    const emoji = emojilib.lib[`${word.replace(/:/g, "")}`]
    return emoji ? emoji.char : word
}

export const setEmojiUrls = async (chunks: TextChunk[]) =>
    Promise.all(
        chunks.map(async chunk =>
            chunk.type === "emoji"
                ? new Promise<TextChunk>(res => {
                      twemoji.parse(replaceEmoji(chunk.caption), (icon: string) =>
                          res({ ...chunk, url: `https://twemoji.maxcdn.com/svg/${icon}.svg` })
                      )
                  })
                : chunk
        )
    )

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
    const chunks = parseText(t.text)

    const value: Thx = {
        receivers: maybeReceivers.map((v: Ok<User>) => v.value),
        giver: giver.value,
        chunks,
        id: t.id,
        clapCount: t.clap_count,
        confettiCount: t.confetti_count,
        wowCount: t.wow_count,
        loveCount: t.love_count,
        time: moment(t.created_at).calendar()
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
