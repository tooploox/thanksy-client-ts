import * as React from "react"
import { Thx } from "./Thx"
import { bind } from "../utils/bem"
import "./ThxList.scss"

const { Block, Element } = bind("ThxList")

const Empty: React.SFC = () => (
    <Element name="EmptyContainer">
        <Element name="Empty" />
        <Element name="Title">No thanks so far</Element>
        <Element name="Subtitle">Be the first one, use Slack, speak up!</Element>
    </Element>
)

export const ThxList: React.SFC<{ thxList: Thx[] }> = p => (
    <Block>
        {p.thxList.length ? (
            <>
                <h1>Recent thanks</h1>
                <Element name="Container">
                    {p.thxList.map(thx => (
                        <Thx {...thx} key={thx.id} />
                    ))}
                </Element>{" "}
            </>
        ) : (
            <Empty />
        )}
    </Block>
)
