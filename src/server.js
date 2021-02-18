/**
 * The starting point of the application.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import express from 'express'
import hbs from 'express-hbs'
import session from 'express-session'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import logger from 'morgan'
import { router } from './routes/router.js'
import http from 'http'
import { Server } from 'socket.io'

// Variable declarations.
const dirFullPath = dirname(fileURLToPath(import.meta.url))
const baseUrl = process.env.BASE_URL || '/'

/**
 * The main function of the application.
 */
const main = async () => {

  // Creates an Express application.
  const app = express()

  app.use(express.json())
  app.use(helmet())

  // Helmet settings.
  app.use(
    helmet.contentSecurityPolicy({
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'script-src': ["'self'", 'code.jquery.com', 'cdn.jsdelivr.net']
      }
    })
  )

  // Handlebars setting.
  app.engine('hbs', hbs.express4({
    defaultLayout: join(dirFullPath, 'views', 'layouts', 'index'),
    partialsDir: join(dirFullPath, 'views', 'partials')
  }))

  // Set view engine.
  app.set('view engine', 'hbs')
  app.set('views', join(dirFullPath, 'views'))

  // Serve static files.
  app.use(express.static(join(dirFullPath, '..', 'public')))

  app.use(logger('dev'))

  // Session middleware
  const sessionOptions = {
    name: process.env.SESSION_NAME,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 15, // 15 minutes
      sameSite: 'lax'
    }
  }

  if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sessionOptions.cookie.secure = true // serve secure cookies
  }

  app.use(session(sessionOptions))

  // Add socket.io
  const server = http.createServer(app)
  const io = new Server(server)

  io.on('connection', (socket) => {
    socket.on("join", function(name) {
      console.log('A user connected...')
    })
    socket.on('disconnect', () => {
      console.log('A user disconnected...')
    })

    socket.on('update', (data) => {
      io.sockets.emit('update', data)
    })
  })

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }
    // Adding socket.io to response object.
    res.io = io

    res.locals.baseUrl = baseUrl

    if (req.session.authorizedUser) {
      res.locals.authorizedUser = req.session.authorizedUser
      res.locals.user = req.session.user
    }

    next()
  })

  // Register routes.
  app.use(baseUrl, router)

  // Error handler.
  app.use(function (err, req, res, next) {
  // 404 Not Found.
  if (err.status === 404) {
    return res
      .status(404)
      .sendFile(join(dirFullPath, 'views', 'errors', '404.html'))
  }

  // 500 Internal Server Error (in production, all other errors send this response).
  if (req.app.get('env') !== 'development') {
    return res
      .status(500)
      .sendFile(join(dirFullPath, 'views', 'errors', '500.html'))
  }

  // Development only!
  // Only providing detailed error in development.

  // Render the error page.
  res
    .status(err.status || 500)
    .render('errors/error', { error: err })
})


  // Starts the HTTP server.
  server.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })

}

main().catch(console.error)
