import * as React from "react"
import { TextChunks } from "./TextChunk"
import { Avatars } from "./Avatars"
import { Reactions } from "./Reactions"

export const Feed: React.SFC<{ thanks: Thx[] }> = ({ thanks }) => (
    <div>
        <h1 className="title">Recent thanks</h1>
        <div className="thanksContainer">
            {thanks.map(thx => (
                <div className="wrapper" key={thx.id}>
                    <div className="giver">
                        <img className="avatar" src={thx.giver.avatar_url} alt={thx.giver.real_name} />
                        <div>
                            <div className="giverName">{thx.giver.real_name}</div>
                            <div className="time">{thx.createdAt}</div>
                        </div>
                    </div>
                    <div className="thanksBox">
                        <TextChunks chunks={thx.chunks} />
                        <Avatars users={thx.receivers} maxCount={11} />
                        <Reactions {...thx} />
                    </div>
                </div>
            ))}
        </div>
    </div>
)
