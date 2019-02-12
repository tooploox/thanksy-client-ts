// ./node_modules/.bin/json-server --watch db.json --middlewares ./auth.js --routes routes.json

export const TOKEN = "123456"

export const route = ({ expectedBearer, response }) =>
    cy.route({
        method: "GET",
        url: "https://thanksy.herokuapp.com/thanks/list",
        onRequest: xhr => expectedBearer && expect(xhr.requestHeaders.Authorization).equal(`Bearer ${expectedBearer}`),
        status: expectedBearer ? 200 : 401,
        response
    })

export const runningServer = () => {
    cy.server()
    cy.clearLocalStorage()
}
const err = { error: "You have to provide a valid access token.2" }
export const serverGivesError = () => route({ response: err, expectedBearer: null })
export const serverGivesData = response => route({ expectedBearer: TOKEN, response })
