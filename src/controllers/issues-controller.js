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
   * Displays a list of products.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async index (req, res, next) {
    try {
      res.render('layouts/index')
    } catch (error) {
      next(error)
    }
  }
}
