module.exports = (function getConfig() {
    const OfflinePlugin = require("offline-plugin")

    let orgEnv = {}
    try {
        orgEnv = require("dotenv").config({ path: ".env" }).parsed
    } catch (err) {
        orgEnv = {}
    }
    console.log(".orgEnv", orgEnv)

    let tsEnv = {}
    try {
        tsEnv = require("dotenv").config({ path: ".timestamp" }).parsed
    } catch (err) {
        tsEnv = {
            BUILD_SHA: "0",
            BUILD_DATE: "today"
        }
    }
    console.log(".tsEnv", tsEnv)

    return {
        entry: "src/index.tsx",
        presets: [require("poi-preset-react")(), require("poi-preset-typescript")()],
        port: 4004,
        env: { ...tsEnv, ...orgEnv },
        plugins: [new OfflinePlugin()],
        html: {
            description:
                "Open-source app that allows people to send appreciation via slack and broadcast it on the TV." +
                tsEnv.BUILD_SHA +
                ", " +
                tsEnv.BUILD_DATE
        }
    }
})()
