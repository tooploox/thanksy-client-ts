import * as React from "react"
import { Thx } from "./Thx"
import { bind } from "../utils/bem"
import "./ThxList.scss"

const { Block, Element } = bind("ThxList")

export const ThxList: React.SFC<{ thxList: Thx[] }> = p => (
    <Block>
        <h1>Recent thanks</h1>
        <Element name="Container">
            {p.thxList.map(thx => (
                <Thx {...thx} key={thx.id} />
            ))}
        </Element>
    </Block>
)
