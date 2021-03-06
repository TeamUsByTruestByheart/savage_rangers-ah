import bcrypt, { hashSync, genSaltSync } from 'bcrypt';
import models from '../models';
import generateToken from '../../helpers/tokens/generate.token';
import sendResult from '../../helpers/results/send.auth';
import blackList from '../../helpers/Blacklist.redis';
import status from '../../helpers/constants/status.codes';
import env from '../../configs/environments';
import sendError from '../../helpers/error.sender';
import errors from '../../helpers/constants/error.messages';
import mailer from '../../helpers/Mailer/index';
import setDefaultConfigs from '../../helpers/create.default.notifications.config';
import successMessage from '../../helpers/constants/success.messages';

const { User } = models;
/**
 * containing all user's model controllers (signup, login)
 *
 * @export
 * @class Auth
 */
export default class Auth {
  /**
   * register a new user
   *
   * @static
   * @param {*} req the request
   * @param {*} res the response to be sent
   * @memberof Auth
   * @returns {Object} res
   */
  static async signup(req, res) {
    const { username, email, password } = req.body;
    const salt = genSaltSync(parseFloat(env.hashRounds));
    const hashedPassword = hashSync(password, salt);
    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });
    await mailer('Please verify your email',
      'Email verification',
      email,
      'passwordResetEmailConfig',
      {
        email,
        buttonText: 'Verify',
        userName: username,
        message:
          "Please click on the link to verify your email for authors haven.If you didn't request this, simply ignore this e-mail.",
        link: `${env.baseUrl}/api/users/verifyEmail`
      });

    // setting default notifications configurations
    await setDefaultConfigs(user.dataValues.id);
    return res
      .status(status.CREATED)
      .json({ status: status.CREATED, message: successMessage.accountCreated });
  }

  /**
   *login an existing user
   *
   * @static
   * @param {*} req the request
   * @param {*} res the response to be sent
   * @memberof Auth
   * @returns {Object} res
   */
  static async login(req, res) {
    const { email, password } = req.body;
    User.findByEmail(email).then((user) => {
      if (user) {
        const isPasswordValid = bcrypt.compareSync(password, user.dataValues.password);
        if (isPasswordValid) {
          if (user.dataValues.verified !== true) {
            return sendError(status.BAD_REQUEST, res, 'email', errors.emailNotConfirmed);
          }
          const tokenData = { id: user.dataValues.id, username: user.dataValues.username, email };
          const token = generateToken(tokenData, env.secret);
          return sendResult(res, status.OK, 'user logged in successfully', user, token);
        }
        return sendError(status.BAD_REQUEST, res, 'error', errors.incorrectCredential);
      }
      return sendError(status.BAD_REQUEST, res, 'error', errors.incorrectCredential);
    });
  }

  /**
   * Signout a user from the system
   *
   * @author: Frank Mutabazi
   * @static
   * @param {object} req - the request object
   * @param {object} res - the result object
   * @memberof signout
   * @returns {object} - the response body
   */
  static async signout(req, res) {
    const token = req.headers.authorization;
    try {
      const blackToken = blackList(token);
      if (blackToken) {
        return res.status(status.OK).json({
          status: status.OK,
          message: 'You are signed out'
        });
      }
    } catch (err) {
      return sendError(status.SERVER_ERROR, res, 'logout', 'Please try again, Thanks');
    }
  }
}
