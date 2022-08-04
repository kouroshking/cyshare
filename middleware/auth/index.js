const jwt = require("jsonwebtoken");
// models
const UserModel = require("../../models/User");
// import authentication middleware
const bodyPayloadExists = require("./bodyPayloadExists");
const registerPayloadExists = require("./registerPayloadExists");
const loginPayloadExists = require("./loginPayloadExists");
const checkUserNameExists = require("./usernameExists");
const emailExists = require("./emailExists");

const registerMiddleware = (allowedMiddleware = {}) => {
  const usingMiddleware = [bodyPayloadExists, registerPayloadExists];

  if (
    !allowedMiddleware.hasOwnProperty("emailExists") ||
    allowedMiddleware.emailExists
  ) {
    usingMiddleware.push(emailExists);
  }
  if (
    !allowedMiddleware.hasOwnProperty("checkUserNameExists") ||
    allowedMiddleware.checkUserNameExists
  ) {
    usingMiddleware.push(checkUserNameExists);
  }

  return usingMiddleware;
};

const loginMiddleware = (allowedMiddleware = {}) => {
  const usingMiddleware = [bodyPayloadExists, loginPayloadExists];

  // if (
  //   !allowedMiddleware.hasOwnProperty("checkUserNameExists") ||
  //   allowedMiddleware.checkUserNameExists
  // ) {
  //   usingMiddleware.push(checkUserNameExists);
  // }

  return usingMiddleware;
};

const authMiddleware = async (req, res, next) => {
  const tokenHeader = req.headers["authorization"];

  if (!tokenHeader || !tokenHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Authentication is invalid.",
      success: false,
    });
  }

  const token = tokenHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "No token provided.",
      success: false,
    });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // checks if the token is not expired
    const currentTime = new Date().getTime() / 1000;
    if (currentTime > decodedToken.exp) {
      return res.status(401).json({
        message: "Invalid token, token expired",
        success: false,
      });
    }

    // sets the user to the request object
    const { id: tokenUserId, username, email } = decodedToken;

    const user = await UserModel.findOne({ _id: tokenUserId, username, email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid token, user not found.",
        success: false,
      });
    }

    const { password, _id: id, ...userData } = user.toObject();

    req.user = { id, ...userData };
    // calls the next middleware
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error,
    });
  }
};

module.exports = {
  registerMiddleware,
  loginMiddleware,
  authMiddleware,
};
