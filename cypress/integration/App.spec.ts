// tslint:disable-next-line
///<reference path="../../node_modules/cypress/types/index.d.ts"/>

describe("App", () => {
    it.skip("cy.get() - query DOM elements", () => {
        cy.visit("http://localhost:4004")
        cy.get("#app .Title").contains("Route")
    })
})
