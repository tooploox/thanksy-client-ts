declare var require: any
const emojiRegex = require("emoji-regex")
const emojilib = require("emojilib")
const twemoji = require("twemoji").default

const emojiByName: SMap<{ char: string }> = {}
const emojiNameByUtf8: SMap<string> = {}

Object.keys(emojilib.lib).forEach(name => (emojiByName[`:${name}:`] = emojilib.lib[name]))
Object.keys(emojiByName).forEach(name => (emojiNameByUtf8[emojiByName[name].char] = name))

const replaceEmoji = (name: string) => (emojiByName[name] ? emojiByName[name].char : name)
const regex = emojiRegex()

export const replaceUtf8Emoji = (text: string) => text.replace(regex, match => emojiNameByUtf8[match] || match)
export const Text = (caption: string): TextChunk => ({ type: "text", caption })
export const Nickname = (caption: string): TextChunk => ({ type: "nickname", caption })
export const Emoji = (url: string, caption: string): TextChunk => ({ type: "emoji", caption, url })

export const parseText = (text: string, acc: TextChunk[] = []): TextChunk[] => {
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
    return text ? [...acc, Text(text)] : acc
}

// console.log(replaceUtf8Emoji("@konrad.kolasa lej ten płyn 💁🏼‍♂️ 🥃"))
const extEmoji = ({ caption }: Emoji, name: string) =>
    Emoji(`https://twemoji.maxcdn.com/svg/${name}.svg`, emojiByName[caption] ? emojiByName[caption].char : caption)

const setEmojiUrl = async (chunk: Emoji): Promise<TextChunk> =>
    new Promise(res => twemoji.parse(replaceEmoji(chunk.caption), (name: string) => res(extEmoji(chunk, name))))

export const setEmojiUrls = async (chunks: TextChunk[]) =>
    Promise.all(chunks.map(c => (c.type === "emoji" ? setEmojiUrl(c) : c)))
