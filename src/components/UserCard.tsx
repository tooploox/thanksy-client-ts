import * as React from "react"
import { bind } from "../utils/bem"
import "./UserCard.scss"
const { Block, Element } = bind("UserCard")

export const UserCard: React.SFC<User & { createdAt: string }> = p => (
    <Block>
        <Element name="Avatar">
            <img src={p.avatar_url} alt={p.real_name} />
        </Element>
        <Element name="Details">
            <Element name="Name">{p.real_name}</Element>
            <Element name="Time">{p.createdAt}</Element>
        </Element>
    </Block>
)
