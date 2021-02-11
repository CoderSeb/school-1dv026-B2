/**
 * Module for the IssuesController.
 *
 * @author Sebastian Åkerblom <sa224ny@student.lnu.se>
 * @version 1.0.0
 */


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
      res.render('issues/index')
    } catch (error) {
      next(error)
    }
  }
}
