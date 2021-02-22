/**
 * The routes.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'
import { IssuesController } from '../controllers/issues-controller.js'
import { HooksController } from '../controllers/hooks-controller.js'

const issuesController = new IssuesController()
const hooksController = new HooksController()
export const router = express.Router()

// Map HTTP verbs and route paths to controller actions.
router.get('/', (req, res, next) => {
  issuesController.index(req, res, next)
})

router.get('/socket', (req, res, next) => {
  hooksController.index(req, res, next)
})

router.post('/webhook/issues', (req, res, next) => {
  hooksController.webHook(req, res, next)
})

router.post('/issues/:id/close', (req, res, next) => {
  hooksController.issueClose(req, res, next)
})

router.post('/issues/:id/open', (req, res, next) => {
  hooksController.issueOpen(req, res, next)
})

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
