import * as React from "react"
import { TextChunks } from "./TextChunks"
import { Avatars } from "./Avatars"
import { Reactions } from "./Reactions"
import { bind } from "../utils/bem"
import { UserCard } from "./UserCard"
import "./ThxCard.scss"

const { Block, Element } = bind("ThxCard")

export const ThxCard: React.SFC<Thx> = p => (
    <Block>
        <UserCard {...p.giver} createdAt={p.createdAt} />
        <Element name="Content">
            <TextChunks chunks={p.chunks} />
            <Avatars users={p.receivers} maxCount={11} />
            <Reactions {...p} />
        </Element>
    </Block>
)
