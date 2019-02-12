export const hasChildren = (name, n) =>
    cy
        .get(name)
        .children()
        .should("have.length", n)

export const hasText = (name, text) =>
    cy
        .get(name)
        .invoke("text")
        .should("equal", text)

export const containsText = (name, text) => cy.get(name).contains(text)
export const childrenContains = (name, n, text) =>
    cy
        .get(name)
        .eq(n)
        .should("contain", text)

export const hasSrc = (name, src) => cy.get(name).should("have.attr", "src", src)
