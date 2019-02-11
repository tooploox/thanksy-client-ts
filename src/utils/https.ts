type HTTPMethods = "GET" | "POST" | "PUT"
export const get = <T>(url: string, data: any = null) => request<T>(url, data, null, "GET")
export const post = <T>(url: string, data: any) => request<T>(url, data, null, "POST")
export const put = <T>(url: string, data: any) => request<T>(url, data, null, "PUT")

type HTTPErrorType = "ServerError" | "UnprocessableEntity" | "UnprocessableResponse"

export type HTTPError = { name: HTTPErrorType; message: string; status: number }
const HTTPError = (name: HTTPErrorType, message: string, status: number): HTTPError => ({ name, message, status })

export const formatParams = (params: any) => {
    const keys = Object.keys(params)
    return keys.length ? `?${keys.map(key => key + "=" + encodeURIComponent(params[key])).join("&")}` : ""
}

export function request<T>(
    url: string,
    data: any = null,
    bearer: string | null = null,
    method: HTTPMethods = "POST"
): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        let resolved = false
        const client = new XMLHttpRequest()

        client.onreadystatechange = () => {
            if (resolved || client.readyState !== 4) return
            resolved = true
            try {
                const res: T = JSON.parse(client.responseText)

                if (client.status === 422) {
                    reject(HTTPError("UnprocessableEntity", "", 422))
                    return
                }
                if (client.status >= 300) {
                    reject(HTTPError("ServerError", `Bad status: ${client.responseText}`, client.status))
                    return
                }
                resolve(res)
            } catch (error) {
                reject(HTTPError("UnprocessableResponse", client.responseText, client.status))
            }
        }

        if (method === "GET" && data) url += formatParams(data)
        client.open(method, url, true)
        if (bearer) client.setRequestHeader("Authorization", "Bearer " + bearer)

        if (method !== "GET" && data) {
            client.setRequestHeader("Content-Type", "application/json; charset=utf-8")
            client.send(JSON.stringify(data))
        } else {
            client.send()
        }
    })
}
