type Validator = (v: any, msg?: string) => null | string
export const isString = (v: any): v is string => typeof v === "string"
export const isNotEmpty: Validator = v =>
    v !== null && v !== "" && (notArray(v) !== null || v.length > 0) ? null : "field cannot be empty"

export const isArray = (ts: any): ts is any[] => typeof ts === "object" && ts.constructor.name === "Array"
export const isNumber = (v: any): v is number => typeof v === "number"

export const notString: Validator = v => (typeof v === "string" ? null : "string expected")
export const notArray: Validator = (ts: any) => (isArray(ts) ? null : "array expected")

export const isRequired: Validator = v => (v !== undefined ? null : "field required")

export const toInt = (v: any, def: number, min = 0, max = 100): number => {
    try {
        const cv = parseInt(v, 10) || def
        if (cv < min) return min
        if (cv > max) return max
        return cv
    } catch {
        return def
    }
}
export const isEmail = (email: string) =>
    // tslint:disable-next-line:max-line-length
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        String(email).toLowerCase()
    )
