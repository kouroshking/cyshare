// models
const UserModel = require("../../models/User");

const checkUserNameExists = async (req, res, next) => {
  try {
    const { username } = req.body;

    const user = await UserModel.findOne({ username });

    if (user) {
      return res.status(400).json({
        message: "username is taken, please choose another one",
        success: false,
      });
    }

    next();
  } catch (error) {
    return res.status(500).json({
      error,
      message: "something went wrong",
      success: false,
    });
  }
};

module.exports = checkUserNameExists;
