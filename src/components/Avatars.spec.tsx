import * as React from "react"
import { shallow, mount } from "enzyme"
import { Avatar, Avatars } from "./Avatars"
import { userFixture } from "../../test/fixtures"
import { mapRepeat } from "../utils"

describe("<Avatar>", () => {
    it("should set background style", () => {
        const url = "https://twemoji.maxcdn.com/2/72x72/1f44c.png"
        const avatar = shallow(<Avatar {...userFixture()} avatar_url={url} />)
        expect(avatar.prop("style")).toEqual({ backgroundImage: `url(${url})` })
    })
})

describe("<Avatars>", () => {
    it("should render all avatars when less than given max", () => {
        const users = mapRepeat(10, i => userFixture({ id: i.toString() }))
        const avatar = mount(<Avatars users={users} maxCount={10} />).find(".Avatar")
        expect(avatar.length).toEqual(10)
    })

    it("should render 5 avatars and display +4", () => {
        const users = mapRepeat(9, i => userFixture({ id: i.toString() }))
        const avatars = mount(<Avatars users={users} maxCount={5} />)
        expect(avatars.find(".Avatar").length).toEqual(5)
        expect(avatars.find(".Avatars__Collapsed").contains("+ 4")).toBeTruthy()
    })
})
