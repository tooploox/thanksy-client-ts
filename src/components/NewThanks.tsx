import * as React from "react"
import ScrollLock from "react-scrolllock"
// import { EmojiText } from "./EmojiText"

import "./NewThanks.scss"

type Props = {
    recentThanks: ThxEntry | null
    newThanksVisible: boolean
}

export const NewThanks: React.SFC<Props> = ({ recentThanks, newThanksVisible }) => {
    if (!recentThanks) return null
    const style: React.CSSProperties = newThanksVisible
        ? { opacity: 1, visibility: "visible" }
        : { opacity: 0, visibility: "hidden" }

    return (
        <div>
            <div className={"animatedTransition"} style={style}>
                <div className={"newThanks"}>
                    <div className={"newThanksJustSent"}>
                        <div className={"container"}>
                            <div>
                                <h2>{recentThanks.giver.real_name} just sent a new Thanks!</h2>
                                {/* <EmojiText text={recentThanks.text} /> */}
                                <div className={"avatarsContainer"}>
                                    {recentThanks.receivers.map(receiver => (
                                        <img
                                            className={"avatar"}
                                            src={receiver.avatar_url}
                                            alt={receiver.name}
                                            key={receiver.id}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="confetti">
                        <img className="confetti" src="../assets/confetti.png" alt="Confetti" />
                    </div>
                    <ScrollLock />
                </div>
            </div>
        </div>
    )
}
