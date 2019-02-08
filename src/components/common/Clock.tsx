import * as React from "react"
import "./Clock.scss"
import { pad } from "../../utils"
export class Clock extends React.Component<{}, { time: string }> {
    state = { time: "" }
    private intervalID: number
    componentDidMount() {
        this.state = this.getTime()
        this.intervalID = setInterval(() => this.setState(this.getTime()), 1000)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    render() {
        return <div className="Clock">{this.state.time}</div>
    }

    private getTime = () => {
        const d = new Date()
        const time = `${d.getHours()}:${d.getMinutes()}:${pad(d.getSeconds(), 2)}`
        return { time }
    }
}
