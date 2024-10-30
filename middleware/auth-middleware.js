const jwt = require("jsonwebtoken");
const { User } = require("../models/User");
const Role = require('../models/Role');

const secretkey = "secretkey";

const authenticateToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send({ message: "Không tìm thấy token" });
  }
  jwt.verify(token, secretkey, async (err, User) => {
    if (err) return res.status(403).send({ message: "Token khOng hợp lệ" });
    req.user = User;
    next();
  });
};

const permissionMiddleware = (requiredPermission) => {
    return async (req, res, next) => {
        const token = req.cookies.token;
        if (!token) 
          return res.status(401).send('Không tìm thấy token');

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).populate('roles');
            if (!user) 
              return res.status(404).send('User ko tìm thấy');

            const permissions = user.roles.flatMap(role => role.permissions);
            const hasPermission = permissions.some(permission => permission.name === requiredPermission);

            if (!hasPermission) 
              return res.status(403).send('Ko có quyền truy cập');

            next();
        } catch (err) {
            return res.status(403).send('Ko có quyền truy cập');
        }
    };
};

module.exports = { authenticateToken, permissionMiddleware };