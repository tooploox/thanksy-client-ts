import * as React from "react"
import { bind } from "../utils/bem"
import "./Avatars.scss"

export const Avatar: React.SFC<User> = p => (
    <div className="Avatar" style={{ backgroundImage: `url(${p.avatar_url})` }} />
)

const { Block, Element } = bind("Avatars")
export const Avatars: React.SFC<{ users: User[]; maxCount: number }> = p => (
    <Block>
        <Element name="Container">
            {p.users
                .slice(0, p.maxCount)
                .reverse()
                .map(u => (
                    <Avatar {...u} key={u.id} />
                ))}
        </Element>
        {p.users.length > p.maxCount ? <Element name="Collapsed">{`+ ${p.users.length - p.maxCount}`}</Element> : null}
    </Block>
)
