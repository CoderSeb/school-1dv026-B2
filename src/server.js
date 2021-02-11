/**
 * The starting point of the application.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

// Imports
import express from 'express'
import hbs from 'express-hbs'
import bodyParser from 'body-parser'
import session from 'express-session'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import helmet from 'helmet'
import logger from 'morgan'
import { connectDB } from './config/mongo.js'
import { router } from './routes/router.js'

// Variable declarations.
const dirFullPath = dirname(fileURLToPath(import.meta.url))
const baseUrl = process.env.BASE_URL || '/'

/**
 * The main function of the application.
 */
const main = async () => {
  await connectDB()

  // Creates an Express application.
  const app = express()

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

  // Body parser and logger.
  app.use(bodyParser.urlencoded({ extended: true }))
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

  // Middleware to be executed before the routes.
  app.use((req, res, next) => {
    // Flash messages - survives only a round trip.
    if (req.session.flash) {
      res.locals.flash = req.session.flash
      delete req.session.flash
    }

    res.locals.baseUrl = baseUrl

    if (req.session.authorizedUser) {
      res.locals.authorizedUser = req.session.authorizedUser
      res.locals.user = req.session.user
    }

    next()
  })

  // Register routes.
  app.use('/', router)

  // Starts the HTTP server.
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log('Press Ctrl-C to terminate...')
  })
}

main().catch(console.error)
