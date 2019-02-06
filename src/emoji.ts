import { getter, remap } from "./utils"

declare var require: any
const emojiRegex = require("emoji-regex")()
const emojilib = require("emojilib")
const twemoji = require("twemoji").default

const emojiByName = remap<{ char: string }>(emojilib.lib, (_, name) => `:${name}:`, v => v)
const emojiNameByUtf8 = remap<{ char: string }, string>(emojiByName, v => v.char, (_, name) => name)

// Object.keys(emojilib.lib).forEach(name => (emojiByName[`:${name}:`] = emojilib.lib[name]))
// Object.keys(emojiByName).forEach(name => (emojiNameByUtf8[emojiByName[name].char] = name))

const replaceEmoji = (name: string) => (emojiByName[name] ? emojiByName[name].char : name)
export const replaceUtf8Emoji = (text: string) => text.replace(emojiRegex, match => emojiNameByUtf8[match] || match)
export const Text = (caption: string): TextChunk => ({ type: "text", caption })
export const Nickname = (caption: string): TextChunk => ({ type: "nickname", caption })
export const Emoji = (caption: string, url: string = ""): TextChunk => ({ type: "emoji", caption, url })

export const parseTextRec = (text: string, acc: TextChunk[] = []): TextChunk[] => {
    const emojiRes = /(:[a-zA-Z_0-9+-]+:)/g.exec(text)
    const emojiIndex = emojiRes ? text.indexOf(emojiRes[0]) : -1

    const nicknameRes = /(@[a-zA-Z_0-9.-]+)/g.exec(text)
    const nicknameIndex = nicknameRes ? text.indexOf(nicknameRes[0]) : -1

    if (emojiRes && (emojiIndex < nicknameIndex || nicknameIndex === -1)) {
        if (emojiIndex !== 0) acc.push(Text(text.substr(0, emojiIndex)))
        acc.push(Emoji(emojiRes[0]))
        return parseTextRec(text.substring(emojiIndex + emojiRes[0].length), acc)
    }

    if (nicknameRes && (nicknameIndex < emojiIndex || emojiIndex === -1)) {
        if (nicknameIndex !== 0) acc.push(Text(text.substr(0, nicknameIndex)))
        acc.push(Nickname(nicknameRes[0]))
        return parseTextRec(text.substring(nicknameIndex + nicknameRes[0].length), acc)
    }
    return text ? [...acc, Text(text)] : acc
}

export const parseText = (text: string, acc: TextChunk[] = []) => parseTextRec(replaceUtf8Emoji(text), acc)

// console.log(replaceUtf8Emoji("@konrad.kolasa lej ten płyn 💁🏼‍♂️ 🥃"))
const extEmoji = ({ caption }: Emoji, name: string) =>
    Emoji(getter(emojiByName[caption], "char") || caption, `https://twemoji.maxcdn.com/svg/${name}.svg`)

const setEmojiUrl = async (c: Emoji): Promise<TextChunk> => {
    if (c.type !== "emoji") return c
    return new Promise(res => twemoji.parse(replaceEmoji(c.caption), (name: string) => res(extEmoji(c, name))))
}

export const setEmojiUrls = async (thxs: Thx[]) =>
    Promise.all(thxs.map(async t => ({ ...t, chunks: await Promise.all(t.chunks.map(setEmojiUrl)) })))
