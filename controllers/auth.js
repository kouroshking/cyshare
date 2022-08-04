// models
const UserModel = require("../models/User");

const register = async (req, res) => {
  try {
    // validating body data

    if (!req.body) {
      return res.status(400).json({
        message: "No data sent",
        success: false,
      });
    }

    // registering user
    const registeredUser = await UserModel.create(req.body);

    if (!registeredUser) {
      return res.status(400).json({
        message: "Failed to register user",
        success: false,
      });
    }

    // generating token
    const token = registeredUser.generateToken();

    // sending the token to the user
    res.status(200).json({
      token,
      message: "User registered successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      error,
      message: "something went wrong while registering user",
      success: false,
    });
  }
};

const login = async (req, res) => {
  try {
    // validating data
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        message: "Please provide username and password",
        success: false,
      });
    }

    // finding user
    const user = await UserModel.findOne({ username });
    // checking if the user exists
    if (!user) {
      return res.status(404).json({
        message: "invalid username or password",
        success: false,
      });
    }

    // checking password
    const isPasswordValid = await user.isPasswordValid(password);
    if (!isPasswordValid) {
      return res.status(404).json({
        message: "invalid username or password",
        success: false,
      });
    }

    // generating token
    const token = user.generateToken();

    // sending the token to the user
    res.status(200).json({
      token,
      message: "User logined successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "something went wrong while logging in user",
      success: false,
      error,
    });
  }
};

module.exports = { login, register };
