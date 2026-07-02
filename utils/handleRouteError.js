import { sendResponse } from "./sendResponse.js"

export function handleRouteError(req, res) {
    console.log(req.method)
    sendResponse(res, 404, 'application/json', JSON.stringify({ "error": "Route not found" }))
}