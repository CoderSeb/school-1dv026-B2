/**
 * Module for the HooksController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import moment from 'moment'

/**
 * Encapsulates a controller.
 */
export class HooksController {
  /**
   * Connects webhook with socket.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    res.sendStatus(101)
  }

  /**
   * Connects webhook with socket.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async webHook (req, res, next) {
    try {
      if (req.headers['x-gitlab-token'] === process.env.GITLAB_TOKEN) {
        const issue = await req.body
        const issueObj = {
          title: issue.object_attributes.title,
          id: issue.object_attributes.iid,
          masterId: issue.object_attributes.id,
          avatar: issue.user.avatar_url,
          state: issue.object_attributes.state,
          isOpen: issue.object_attributes.state === 'opened',
          description: issue.object_attributes.description,
          creator: issue.object_attributes.author_id === 558 ? 'Sebastian Åkerblom' : issue.user.name,
          created: moment(new Date(issue.object_attributes.created_at)).fromNow(),
          updated: moment(new Date(issue.object_attributes.updated_at)).fromNow(),
          labels: issue.object_attributes.labels
        }
        res.io.emit('update', issueObj)
        res.status(200).send('New information from socket!')
      } else {
        res.sendStatus(403)
      }
    } catch (err) {
      next(err)
    }
  }
}
