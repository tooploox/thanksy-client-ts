import * as React from "react"
import ScrollLock from "react-scrolllock"
import { bind } from "../utils/bem"
import { MapState, actions, MapDispatch } from "../store"
import { connect } from "react-redux"
import "./Login.scss"
import { Just, equal } from "../models"

const { Block, Element } = bind("Login")
type StateProps = { token: string; error: string }
type ActionProps = { onTokenChange: F1<string>; login: F0 }
export const LoginPure: React.SFC<StateProps & ActionProps> = p => (
    <Block>
        <Element name="ContentLimiter">
            <Element name="Logo" />
            <Element name="Mission">Improving your company's culture</Element>
            <input
                ref={(input: any) => input && input.focus()}
                value={p.token}
                onChange={e => p.onTokenChange(e.target.value)}
                placeholder="Security code"
            />
            <Element name="Error">{p.error}</Element>
            <p>Ask a person who has deployed Thanksy on the server about the security code.</p>
            <button onClick={p.login}>Login</button>
            <ScrollLock />
        </Element>
        <Element name="Blur" />
    </Block>
)

const mapState: MapState<StateProps> = s => ({
    token: s.app.token,
    error:
        equal(s.app.apiState, Just("InvalidToken")) && !s.app.isTokenFresh && s.app.token.length > 0
            ? "Security code is not valid"
            : ""
})

const mapDispatch: MapDispatch<ActionProps> = d => ({
    onTokenChange: v => d(actions.updateToken(v)),
    login: () => d(actions.login())
})

export const Login = connect<StateProps, ActionProps, {}, RootState>(
    mapState,
    mapDispatch
)(LoginPure)
