/**
 * The routes.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import express from 'express'

export const router = express.Router()
// Routing for landing page.

// Catch 404 (ALWAYS keep this as the last route).
router.use('*', (req, res, next) => next(res.redirect(404, process.env.BASE_URL + 'login')))
