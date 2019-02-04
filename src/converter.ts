export const Text = (caption: string): TextChunk => ({ type: "text", caption })
export const Nickname = (caption: string): TextChunk => ({ type: "nickname", caption })
export const Emoji = (url: string | null, caption: string): TextChunk => ({ type: "emoji", caption, url })

export const parse = (text: string, acc: TextChunk[] = []): TextChunk[] => {
    if (!text || !text.length) return acc
    const emojiRes = /(:[a-zA-Z_0-9+-]+:)/g.exec(text)
    const emojiIndex = emojiRes ? text.indexOf(emojiRes[0]) : -1

    const nicknameRes = /(@[a-zA-Z_0-9.-]+)/g.exec(text)
    const nicknameIndex = nicknameRes ? text.indexOf(nicknameRes[0]) : -1

    if (emojiRes && (emojiIndex < nicknameIndex || nicknameIndex === -1)) {
        if (emojiIndex !== 0) acc.push(Text(text.substr(0, emojiIndex)))
        acc.push(Emoji("url", emojiRes[0]))
        return parse(text.substring(emojiIndex + emojiRes[0].length), acc)
    }

    if (nicknameRes && (nicknameIndex < emojiIndex || emojiIndex === -1)) {
        if (nicknameIndex !== 0) acc.push(Text(text.substr(0, nicknameIndex)))
        acc.push(Nickname(nicknameRes[0]))
        return parse(text.substring(nicknameIndex + nicknameRes[0].length), acc)
    }
    return [...acc, Text(text)]
}

// TODO: real conversion here - check each field and its type
// TODO: user converter - use that one for receivers and giver
// TODO: get url on text parse result using twemoji.parse's callback

export const convert = (data: ThxEntry): Maybe<ThxEntry> => {
    if (!data || Object.keys(data).length < 10) return { type: "nothing" }

    const value: ThxEntry = {
        ...data,
        text: parse(data.text as any)
    }
    return { type: "some", value }
}
