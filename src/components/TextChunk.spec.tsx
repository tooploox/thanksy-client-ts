import * as React from "react"
import { shallow, mount } from "enzyme"

import { TextChunk, TextChunks } from "./TextChunk"
import { Text, Nickname, Emoji } from "../emoji"

describe("<TextChunk>", () => {
    it("should exist", () => expect(TextChunk).toBeDefined())
    it("should render text chunk", () =>
        expect(shallow(<TextChunk value={Text("Foo")} />).contains("Foo")).toEqual(true))
    it("should render nickname chunk", () => {
        const chunk = shallow(<TextChunk value={Nickname("@foo")} />).dive()
        expect(chunk.find("mark").contains("@foo")).toBeTruthy()
    })

    it("should render emoji chunk", () => {
        const url = "https://twemoji.maxcdn.com/2/72x72/1f44c.png"
        const img = shallow(<TextChunk value={Emoji("👌", url)} />)
            .dive()
            .find("img")

        expect(img.prop("src")).toEqual(url)
        expect(img.prop("alt")).toEqual("👌")
    })
})

describe("<TextChunks>", () => {
    const chunks = [
        Emoji(":wow:", "wow-url"),
        Text(" Thanks "),
        Nickname("@charlie.hebdo"),
        Text(" for keeping the good sense of humor "),
        Emoji(":fist:", "fist-url")
    ]

    it("Renders all given chunks", () => {
        const cs = mount(<TextChunks chunks={chunks} />)

        chunks.forEach((value, i) => expect(cs.childAt(i).props()).toEqual({ value }))

        const marks = cs.find("mark")
        expect(marks.length).toEqual(1)
        expect(marks.last().contains("@charlie.hebdo")).toBeTruthy()

        const spans = cs.find("span")
        expect(spans.length).toEqual(2)
        expect(spans.first().contains(" Thanks ")).toBeTruthy()
        expect(spans.last().contains(" for keeping the good sense of humor ")).toBeTruthy()

        const imgs = cs.find("img")
        expect(imgs.length).toEqual(2)
        expect(imgs.first().prop("src")).toEqual("wow-url")
        expect(imgs.last().prop("src")).toEqual("fist-url")
    })
})
