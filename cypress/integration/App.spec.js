// tslint:disable-next-line
///<reference path="../../node_modules/cypress/types/index.d.ts"/>

import { thxListFixture, thxFixture, userFixture } from "../fixtures"
import * as api from "../support/api"
import { isLoginPage, LoginPage, isThxListPage } from "../support"
import * as el from "../support/el"
describe("Login Page", () => {
    it("Displays `Login page` with no input when server return `Invalid token` on initial request", () => {
        api.runningServer()
        api.serverGivesError()
        cy.visit("/")
        isLoginPage({ error: "", token: "" })
        cy.get(LoginPage.tokenInput).type("1234")
        cy.get(LoginPage.loginButton).click()
        isLoginPage({ token: "1234", error: "Security code is not valid" })
    })

    it("Allows to login with valid token and displays Thx list", () => {
        api.runningServer()
        api.serverGivesError()
        cy.visit("/")
        isLoginPage({ error: "", token: "" })
        cy.get(LoginPage.tokenInput).type(api.TOKEN)
        const response = thxListFixture(2)
        api.serverGivesData(response)
        cy.get(LoginPage.loginButton).click()
        isThxListPage(response)
    })

    it("Displays Thx List Page when valid token is present in localstorage", () => {
        api.runningServer()
        const response = thxListFixture(1)
        api.serverGivesData(response)
        cy.visit("/", {
            onBeforeLoad: ({ localStorage }) => localStorage.setItem("ThanksyToken", api.TOKEN)
        })
        isThxListPage(response)
    })

    it("Keeps token in localstorage and skips Login page when revisited", () => {
        api.runningServer()
        api.serverGivesError()
        cy.visit("/")
        isLoginPage({ error: "", token: "" })
        cy.get(LoginPage.tokenInput).type(api.TOKEN)
        const response = thxListFixture(1)
        api.serverGivesData(response)
        cy.get(LoginPage.loginButton).click()
        isThxListPage(response)
        cy.visit("/")
    })

    it("Shows new Thx page and hides it after 9s", () => {
        api.runningServer()
        const [t1, t2] = thxListFixture(2)
        api.serverGivesData([t1])
        cy.visit("/", {
            onBeforeLoad: ({ localStorage }) => localStorage.setItem("ThanksyToken", api.TOKEN)
        })
        isThxListPage([t1])
        cy.wait(7000)
        t2.giver.real_name = "Elsa Cayat"
        api.serverGivesData([t1, t2])
        el.hasText(".NewThx .NewThx__ContentLimiter h2", "Elsa just sent a new Thanks!")
        cy.wait(9000)
        el.notPresent(".NewThx")
        isThxListPage([t1, t2])
    })
})
