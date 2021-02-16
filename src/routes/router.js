/**
 * The routes.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'

const issuesController = new IssuesController()
export const router = express.Router()

// Map HTTP verbs and route paths to controller actions.
router.get('/', (req, res, next) => {
  issuesController.index(req, res, next)
})

router.post('/webhook/issues', (req, res, next) => {
  issuesController.webHook(req, res, next)
})


// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})

