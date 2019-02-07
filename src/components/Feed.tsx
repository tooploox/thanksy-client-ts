import * as React from "react"
import { ThxCard } from "./ThxCard"

export const Feed: React.SFC<{ thanks: Thx[] }> = ({ thanks }) => (
    <>
        <h1 className="title">Recent thanks</h1>
        <div className="thanksContainer">
            {thanks.map(thx => (
                <ThxCard {...thx} key={thx.id} />
            ))}
        </div>
    </>
)
