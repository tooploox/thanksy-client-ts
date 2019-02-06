import { toInt, isNumber, isString } from "./converter"

describe("converter", () => {
    describe("isNumber()", () => {
        it("fails when not number is given", () => {
            expect(isNumber("foo")).toBeFalsy()
            expect(isNumber({})).toBeFalsy()
            expect(isNumber(null)).toBeFalsy()
            expect(isNumber(() => false)).toBeFalsy()
        })
        it("succeeds when number is given", () => {
            expect(isNumber(1)).toBeTruthy()
            expect(isNumber(-1)).toBeTruthy()
            expect(isNumber(0)).toBeTruthy()
        })
    })

    describe("isString()", () => {
        it("fails when not number is given", () => {
            expect(isString(1)).toBeFalsy()
            expect(isString({})).toBeFalsy()
            expect(isString(null)).toBeFalsy()
            expect(isString(() => false)).toBeFalsy()
        })
        it("succeeds when number is given", () => {
            expect(isString("")).toBeTruthy()
            expect(isString("-1")).toBeTruthy()
        })
    })

    describe("toInt converter", () => {
        it("converts int to int", () => expect(toInt(100, 1)).toEqual(100))
        it("converts string to int", () => expect(toInt("100", 1)).toEqual(100))
        it("converts string to int and gives min value", () => expect(toInt("10", 100, 11)).toEqual(11))
        it("converts string to int and gives max value", () => expect(toInt("1000", 100, 11, 999)).toEqual(999))
        it("converts to int and gives def if fails", () => {
            expect(toInt({}, 100)).toEqual(100)
            expect(toInt("foo", 100)).toEqual(100)
            expect(toInt(null, 100)).toEqual(100)
            expect(toInt(undefined, 100)).toEqual(100)
        })
    })
})
