import * as React from "react"

declare var require: any
const emojilib = require("emojilib")
const twemoji = require("twemoji").default

import * as sanitizeHtml from "sanitize-html"

const replaceEmoji = (word: string) => {
    const emoji = emojilib.lib[`${word.replace(/:/g, "")}`]
    return emoji ? emoji.char : word
}

// const parseCb = (icon: string) => console.log(`https://twemoji.maxcdn.com/svg/${icon}.svg`)
// twemoji.parse(replaceEmoji(":smile:"), { callback: parseCb })

const parseCb2 = (icon: string) => console.log(`https://twemoji.maxcdn.com/svg/${icon}.svg`)
twemoji.parse(replaceEmoji("🤑"), { callback: parseCb2 })

const EmojiWord: React.SFC<{ word: string }> = ({ word }) => {
    if (word[0] === "@") return <mark>{` ${word} `}</mark>
    return (
        <span
            className="emoji"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: ` ${twemoji.parse(replaceEmoji(sanitizeHtml(word)))} ` }}
        />
    )
}

export const EmojiText: React.SFC<{ text: string }> = ({ text }) => (
    <div>
        {text.split(" ").map((word, index) => (
            <EmojiWord word={word} key={index} />
        ))}
    </div>
)
