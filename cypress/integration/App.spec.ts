// tslint:disable-next-line
///<reference path="../../node_modules/cypress/types/index.d.ts"/>
// ./node_modules/.bin/json-server --watch db.json --middlewares ./auth.js --routes routes.json

const nmap = (length, cb) => Array.apply(null, { length }).map((_, id) => cb(id))

const userFixture = (user = {}) => ({
    id: "U2JH4TDU1",
    name: "foo.bar",
    real_name: "Foo Bar",
    avatar_url: "https://openclipart.org/image/2400px/svg_to_png/277087/Female-Avatar-3.png",
    created_at: "2019-02-01T14:37:31.852Z",
    updated_at: "2019-02-11T19:17:51.102Z",
    ...user
})

const thxFixture = (thx = {}) => ({
    id: 0,
    giver: userFixture(),
    receivers: [userFixture({ name: "foo" })],
    love_count: 1,
    confetti_count: 1,
    clap_count: 2,
    wow_count: 0,
    text: ":ninja: for :chicken:",
    created_at: "2019-02-11T19:17:51.110Z",
    updated_at: "2019-02-11T19:17:51.110Z",
    popularity: 4,
    ...thx
})

const thxListFixture = cnt =>
    nmap(cnt, tid =>
        thxFixture({
            id: tid,
            giver: userFixture({ real_name: `Giver real name ${tid}` }),
            receivers: nmap(tid + 1, rid => userFixture({ real_name: `Receiver real name ${rid}` })),
            text: `${tid + 1} x :chicken: on the wall`,
            love_count: tid,
            confetti_count: tid + 1,
            clap_count: tid + 2,
            wow_count: tid + 3
        })
    )

const err = { error: "You have to provide a valid access token.2" }

const LoginPageContent = ".Login__ContentLimiter"
const LoginPage = {
    tokenInput: `${LoginPageContent} input`,
    loginButton: `${LoginPageContent} button`,
    errorLabel: ".Login__Error",
    missionHeader: ".Login__Mission"
}

const ThxListContent = ".ThxList"
const ThxListPage = {
    title: `${ThxListContent} h1`,
    thx: ".ThxList__Container .Thx"
}

const ThxPage = id => ({
    name: `#thx${id} .UserHeader .UserHeader__Name`,
    time: `#thx${id} .UserHeader .UserHeader__Time`,
    chunks: `#thx${id} .TextChunks`,
    avatars: `#thx${id} .Avatars__Container`,
    love: `#thx${id} .Reaction--love .Reaction__Count`,
    wow: `#thx${id} .Reaction--wow .Reaction__Count`,
    clap: `#thx${id} .Reaction--clap .Reaction__Count`,
    confetti: `#thx${id} .Reaction--confetti .Reaction__Count`
})

const route = ({ expectedBearer, response }) =>
    cy.route({
        method: "GET",
        url: "https://thanksy.herokuapp.com/thanks/list",
        onRequest: xhr => expectedBearer && expect(xhr.requestHeaders.Authorization).equal(`Bearer ${expectedBearer}`),
        status: expectedBearer ? 200 : 401,
        response
    })

const runningServer = data => {
    cy.server()
    cy.clearLocalStorage()
    route(data)
}

const TOKEN = "123456"
const HOST = "http://localhost:4004"

describe("Login Page", () => {
    const isLoginPage = ({ error, token }) => {
        cy.get(LoginPage.missionHeader).contains("Improving your company's culture")
        cy.get(LoginPage.tokenInput).should("have.value", token)
        cy.get(LoginPage.errorLabel)
            .invoke("text")
            .should("equal", error)
        cy.get(LoginPage.loginButton).contains("Login")
    }

    const isThxPresent = thx => {
        const i = thx.id
        const Thx = ThxPage(i)

        cy.get(Thx.name)
            .invoke("text")
            .should("equal", `Giver real name ${i}`)

        cy.get(Thx.time).contains(" at 20:17")

        cy.get(Thx.chunks)
            .children()
            .should("have.length", 3)

        cy.get(`${Thx.chunks} span`)
            .eq(0)
            .should("contain", `${i + 1} x `)

        cy.get(`${Thx.chunks} span`)
            .eq(1)
            .should("contain", `on the wall`)

        cy.get(`${Thx.chunks} img`).should("have.attr", "src", "https://twemoji.maxcdn.com/2/72x72/1f414.png")

        cy.get(Thx.avatars)
            .children()
            .should("have.length", i + 1)
        cy.get(Thx.love)
            .invoke("text")
            .should("equal", `${i}`)
        cy.get(Thx.confetti)
            .invoke("text")
            .should("equal", `${i + 1}`)
        cy.get(Thx.clap)
            .invoke("text")
            .should("equal", `${i + 2}`)
        cy.get(Thx.wow)
            .invoke("text")
            .should("equal", `${i + 3}`)
    }

    const isThxListPage = thxs => {
        cy.get(ThxListPage.title).contains("Recent thanks")
        cy.get(ThxListPage.thx).should("have.length", thxs.length)
        thxs.forEach(isThxPresent)
    }

    it("Displays `Login page` with no input when server return `Invalid token` on initial request", () => {
        runningServer({ response: err, expectedBearer: null })
        cy.visit(HOST)
        isLoginPage({ error: "", token: "" })
        cy.get(LoginPage.tokenInput).type("1234")
        cy.get(LoginPage.loginButton).click()
        isLoginPage({ token: "1234", error: "Security code is not valid" })
    })

    it("Allows to login with valid token and displays Thx list", () => {
        runningServer({ response: err, expectedBearer: null })
        cy.visit(HOST)
        isLoginPage({ error: "", token: "" })
        cy.get(LoginPage.tokenInput).type("123456")
        const response = thxListFixture(6)
        route({ expectedBearer: TOKEN, response })
        cy.get(LoginPage.loginButton).click()
        isThxListPage(response)
    })
})
