import * as React from "react"
import "./Version.scss"
import { env } from "../../store"
export const Version: React.SFC = () => (
    <div className="Version">
        <div className="Name">Thanksy 2.1</div>
        <div className="Version__Build">
            BUILD: {env.buildDate}, SHA: {env.sha}
        </div>
    </div>
)
