import { Crypto, JWT } from '../helpers';
import { titleCase, successRes } from '../utils';
import { User } from '../models';

/**
 * 登录
 * @method    {Post}
 * @property  {String}  body._id              [账号]
 * @property  {String}  body.originalPwd      [密码]
 * @property  {String}  body.identity         [身份]
 */
function login ({ body }, res, next) {
  let userInfo;
  const { _id, originalPwd, identity } = body;
  User[titleCase(identity)].getById(_id)
    .then(({ salt, pwd, username }) => {
      userInfo = {
        username,
        identity
      };
      return Crypto.decrypt(originalPwd, salt, pwd);
    })
    .then(() => JWT.creat(_id, userInfo.username, identity))
    .then(token => res.json({
      ...successRes,
      result: {
        token,
        userInfo
      }
    }))
    .catch(next);
}

function load (req, res, next) {
  const { _id, identity } = req.user;
  User[titleCase(identity)].getById(_id)
    .then(({ username }) => res.json({
      ...successRes,
      result: {
        username,
        identity
      }
    }))
    .catch(next);
}

export default {
  login,
  load
};
