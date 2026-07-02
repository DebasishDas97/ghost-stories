import http from 'node:http'
import { serveStatic } from './utils/serveStatic.js'
import { handleGet, handlePost, handleNews } from './handlers/routeHandlers.js'
import { handleRouteError } from './utils/handleRouteError.js'

const PORT = 8000

const __dirname = import.meta.dirname

const server = http.createServer(async (req, res) => {

    if (req.url === '/api') {

        if (req.method === 'GET') {
            return await handleGet(res)
        }

        else if (req.method === 'POST') {
            await handlePost(req, res)
        } else {
            return handleRouteError(req, res)
        }

    } else if (req.url === "/api/news") {

      return handleNews(req, res)

    } else if (!req.url.startsWith('/api')) {

        return await serveStatic(req, res, __dirname)

    } else {
        handleRouteError(req, res)
    }
})

server.listen(PORT, () => console.log(`Connected on port: ${PORT}`))
