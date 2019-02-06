import * as React from "react"
import { connect } from "react-redux"
import { NewThanks } from "../components/NewThanks"
import { Feed } from "../components/Feed"
import { loadFeed } from "../api"

// const audio = new Audio(cheer)
const FEED_LONG_PULLING_DELAY_MS = 10000
const NEW_THANKS_DISPLAYING_TIME_MS = 5000

export class MainPlain extends React.Component {
    state = {
        thanks: [] as Thx[],
        recentThanks: null as (Thx | null),
        newThanksVisible: true
    }

    componentDidMount() {
        loadFeed().then(data => this.updateThanks(data))
        setTimeout(() => loadFeed().then(data => this.updateThanks(data)), FEED_LONG_PULLING_DELAY_MS)
    }

    updateThanks = (updatedThanks: Thx[]) => {
        const { thanks } = this.state
        const newThanksAdded = thanks.length > 0 && thanks[0].id !== updatedThanks[0].id
        if (newThanksAdded) this.showNewThanksPopup(updatedThanks[0])
        this.setState({ thanks: updatedThanks })
    }

    showNewThanksPopup = (newThanks: Thx) => {
        // this.audio.play()
        this.setState({ recentThanks: newThanks, newThanksVisible: true })
        setTimeout(() => this.setState({ newThanksVisible: false }), NEW_THANKS_DISPLAYING_TIME_MS)
    }

    render() {
        return (
            <>
                <Feed thanks={this.state.thanks} />
                <NewThanks recentThanks={this.state.recentThanks} newThanksVisible={this.state.newThanksVisible} />
            </>
        )
    }
}

export const Main = connect()(MainPlain)
