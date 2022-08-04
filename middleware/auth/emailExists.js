// models
const UserModel = require("../../models/User");

const emailExists = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "email has been used before, use another email or login",
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

module.exports = emailExists;
