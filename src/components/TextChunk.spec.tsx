import * as React from "react"
import { shallow } from "enzyme"

import { TextChunk } from "./TextChunk"
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
