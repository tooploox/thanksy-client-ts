import * as React from "react"
import ScrollLock from "react-scrolllock"
import { TextChunks } from "./TextChunks"
import { Avatars } from "./Avatars"
import { bind } from "../utils/bem"

import "./NewThx.scss"

const { Block, Element } = bind("NewThx")
type Props = {
    recentThanks: Thx
    newThanksVisible: boolean
}

// const audio = new Audio(cheer)

export const NewThx: React.SFC<Props> = ({ recentThanks }) => {
    return (
        <Block>
            <Element name="ContentLimiter">
                <h2>{recentThanks.giver.real_name.replace(/ .*/, "")} just sent a new Thanks!</h2>
                <TextChunks centred light chunks={recentThanks.chunks} />
                <Avatars users={recentThanks.receivers} maxCount={11} />
                <ScrollLock />
            </Element>
        </Block>
    )
}
