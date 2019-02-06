import * as React from "react"
// import { EmojiText } from "./EmojiText"

declare var require: any
const emojilib = require("emojilib")
const twemoji = require("twemoji").default

const replaceEmoji = (word: string) => {
    const emoji = emojilib.lib[`${word.replace(/:/g, "")}`]
    return emoji ? emoji.char : word
}

// const parseCb = (icon: string) => console.log(`https://twemoji.maxcdn.com/svg/${icon}.svg`)
// twemoji.parse(replaceEmoji(":smile:"), { callback: parseCb })

const parseCb2 = (icon: string) => console.log(`foo https://twemoji.maxcdn.com/svg/${icon}.svg`)
twemoji.parse(replaceEmoji("🤑"), { callback: parseCb2 })

const Chunk: React.SFC<{ value: TextChunk }> = ({ value }) => {
    if (value.type === "nickname") return <b>{value.caption}</b>
    if (value.type === "emoji") return <img src={value.url || ""}>{value.caption}</img>
    return <b>{value.caption}</b>
}

export const Feed: React.SFC<{ thanks: Thx[] }> = ({ thanks }) => {
    return (
        <div>
            <h1 className="title">Recent thanks</h1>
            <div className="thanksContainer">
                {thanks.map(thx => (
                    <div className="wrapper" key={thx.id}>
                        <div className="giver">
                            <img className="avatar" src={thx.giver.avatar_url} alt={thx.giver.real_name} />
                            <div>
                                <div className="giverName">{thx.giver.real_name}</div>
                                <div className="time">{thx.time}</div>
                            </div>
                        </div>
                        <div className="thanksBox">
                            {thx.chunks.map((v, key) => (
                                <Chunk key={key} value={v} />
                            ))}
                            <div className="avatarsContainer">
                                {thx.receivers.map(receiver => (
                                    <img
                                        className="avatar"
                                        src={receiver.avatar_url}
                                        alt={receiver.name}
                                        key={receiver.id}
                                    />
                                ))}
                            </div>
                            <div className="reactions">
                                <ul>
                                    <li>
                                        <span role="img" aria-label="heart emoji">
                                            <img src="https://twemoji.maxcdn.com/2/72x72/2764.png" alt="heart emoji" />
                                        </span>{" "}
                                        {thx.loveCount}
                                    </li>
                                    <li>
                                        <span role="img" aria-label="confetti emoji">
                                            <img
                                                src="https://twemoji.maxcdn.com/72x72/1f389.png"
                                                alt="confetti emoji"
                                            />
                                        </span>{" "}
                                        {thx.confettiCount}
                                    </li>
                                    <li>
                                        <span role="img" aria-label="clap emoji">
                                            <img src="https://twemoji.maxcdn.com/72x72/1f44f.png" alt="clap emoji" />
                                        </span>{" "}
                                        {thx.clapCount}
                                    </li>
                                    <li>
                                        <span role="img" aria-label="wow emoji">
                                            <img src="https://twemoji.maxcdn.com/72x72/1f62f.png" alt="wow emoji" />
                                        </span>{" "}
                                        {thx.wowCount}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
