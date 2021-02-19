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
    if (req.headers['x-gitlab-event']) {
      const issue = await req.body
      const issueObj = {
        title: issue.object_attributes.title,
        id: issue.object_attributes.iid,
        state: issue.object_attributes.state,
        description: issue.object_attributes.description,
        creator: issue.user.name,
        created: moment(new Date(issue.object_attributes.created_at)).fromNow(),
        updated: moment(new Date(issue.object_attributes.updated_at)).fromNow(),
        labels: issue.object_attributes.labels
      }
      res.io.emit('update', issueObj)
      res.status(200).send('New information from socket!')
    }
  }
}
