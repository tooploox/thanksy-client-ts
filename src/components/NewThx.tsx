import * as React from "react"
import ScrollLock from "react-scrolllock"
import { TextChunks } from "./TextChunks"
import { Avatars } from "./Avatars"
import { ConfettiController } from "../ConfettiController"
import { bind } from "../utils/bem"

import "./NewThx.scss"

const { Block, Element } = bind("NewThx")

export const NewThx: React.SFC<{ thx: Thx }> = ({ thx }) => (
    <Block>
        <Element name="ContentLimiter">
            <h2>{thx.giver.real_name.replace(/ .*/, "")} just sent a new Thanks!</h2>
            <TextChunks centred light chunks={thx.chunks} />
            <Avatars users={thx.receivers} maxCount={11} />
            <Element name="ConfettiContainer">
                <div ref={ref => setTimeout(() => ConfettiController(ref), 100)} />
            </Element>
            <ScrollLock />
        </Element>
    </Block>
)
