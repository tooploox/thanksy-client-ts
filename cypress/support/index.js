import * as el from "./el"

const LoginPageContent = ".Login__ContentLimiter"
export const LoginPage = {
    tokenInput: `${LoginPageContent} input`,
    loginButton: `${LoginPageContent} button`,
    errorLabel: ".Login__Error",
    missionHeader: ".Login__Mission"
}

const ThxListContent = ".ThxList"
export const ThxListPage = {
    title: `${ThxListContent} h1`,
    thx: ".ThxList__Container .Thx"
}

export const ThxPage = id => ({
    name: `#thx${id} .UserHeader .UserHeader__Name`,
    time: `#thx${id} .UserHeader .UserHeader__Time`,
    chunks: `#thx${id} .TextChunks`,
    avatars: `#thx${id} .Avatars__Container`,
    love: `#thx${id} .Reaction--love .Reaction__Count`,
    wow: `#thx${id} .Reaction--wow .Reaction__Count`,
    clap: `#thx${id} .Reaction--clap .Reaction__Count`,
    confetti: `#thx${id} .Reaction--confetti .Reaction__Count`
})

export const isLoginPage = ({ error, token }) => {
    el.hasText(LoginPage.missionHeader, "Improving your company's culture")
    cy.get(LoginPage.tokenInput).should("have.value", token)
    el.hasText(LoginPage.errorLabel, error)
    el.hasText(LoginPage.loginButton, "Login")
}

const isThxPresent = ({ giver, id }) => {
    const Thx = ThxPage(id)
    el.hasText(Thx.name, giver.real_name)
    el.containsText(Thx.time, " at 20:17")
    el.hasChildren(Thx.chunks, 3)
    el.childrenContains(`${Thx.chunks} span`, 0, `${id + 1} x `)
    el.childrenContains(`${Thx.chunks} span`, 1, `on the wall`)
    el.hasSrc(`${Thx.chunks} img`, "https://twemoji.maxcdn.com/2/72x72/1f414.png")
    el.hasChildren(Thx.avatars, id + 1)
    el.hasText(Thx.love, `${id}`)
    el.hasText(Thx.confetti, `${id + 1}`)
    el.hasText(Thx.clap, `${id + 2}`)
    el.hasText(Thx.wow, `${id + 3}`)
}

export const isThxListPage = thxs => {
    el.hasText(ThxListPage.title, "Recent thanks")
    cy.get(ThxListPage.thx).should("have.length", thxs.length)
    thxs.forEach(isThxPresent)
}
