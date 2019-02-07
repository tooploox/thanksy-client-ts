import * as React from "react"
import { bind } from "../utils/bem"
import "./Reactions.scss"

const { Block, Element } = bind("Reaction")

type ReactionProps = {
    kind: "love" | "confetti" | "wow" | "clap"
    count: number
}

export const Reaction: React.SFC<ReactionProps> = p => (
    <Block modifiers={{ [p.kind]: true }}>
        <Element name="Icon" />
        <Element name="Count">{p.count}</Element>
    </Block>
)

export const Reactions: React.SFC<Thx> = p => (
    <div className="Reactions">
        <Reaction kind="love" count={p.loveCount} />
        <Reaction kind="confetti" count={p.confettiCount} />
        <Reaction kind="clap" count={p.clapCount} />
        <Reaction kind="wow" count={p.wowCount} />
    </div>
)
