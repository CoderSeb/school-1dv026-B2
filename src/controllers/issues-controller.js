/**
 * Module for the IssuesController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */

import axios from 'axios'
import moment from 'moment'

/**
 * Encapsulates a controller.
 */
export class IssuesController {
  /**
   * Displays home view.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      const viewData = await axios({
        method: 'GET',
        url: `${process.env.GITLAB_URL}/${process.env.GITLAB_PROJECT_ID}/issues`,
        headers: {
          Authorization: 'Bearer ' + process.env.GITLAB_TOKEN
        }
      }).then(response => {
        const results = []
        response.data.forEach(issue => {
          const issueObj = {
            title: issue.title,
            id: issue.iid,
            masterId: issue.id,
            state: issue.state,
            isOpen: issue.state === 'opened',
            description: issue.description,
            creator: issue.author.name,
            avatar: issue.author.avatar_url,
            created: moment(issue.created_at).fromNow(),
            updated: moment(issue.updated_at).fromNow(),
            labels: issue.labels
          }
          results.push(issueObj)
        })
        return results.sort((a, b) => a.id - b.id)
      })
      res.render('issues/index', { viewData })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Sends a request to gitlab to reopen or close an issue.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async issueOpenClose (req, res, next) {
    axios({
      method: 'PUT',
      url: req.params.state === 'open' ? `${process.env.GITLAB_URL}/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}?state_event=reopen` : `${process.env.GITLAB_URL}/${process.env.GITLAB_PROJECT_ID}/issues/${req.params.id}?state_event=close`,
      headers: {
        Authorization: 'Bearer ' + process.env.GITLAB_TOKEN
      }
    }).then(response => {
      res.status(200).send('Issue is being reopened/closed...')
    }).catch(err => {
      console.log('Ops! Something went wrong! ' + err.message)
      next(err)
    })
  }
}
