import * as React from "react"
import { TextChunks } from "./TextChunks"
import { Avatars } from "./Avatars"
import { Reactions } from "./Reactions"
import { bind } from "../utils/bem"
import { UserHeader } from "./UserHeader"
import "./Thx.scss"

const { Block, Element } = bind("Thx")

export const Thx: React.SFC<Thx> = p => (
    <Block id={`thx${p.id.toString()}`}>
        <UserHeader {...p.giver} createdAt={p.createdAt} />
        <Element name="Content">
            <TextChunks chunks={p.chunks} />
            <Avatars users={p.receivers} maxCount={11} />
            <Reactions {...p} />
        </Element>
    </Block>
)
