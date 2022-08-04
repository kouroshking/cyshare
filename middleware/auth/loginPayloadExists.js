const loginPayloadExists = (req, res, next) => {
  const requiredFields = ["username", "password"];

  for (let field of requiredFields) {
    if (!req.body[field]) {
      return res.status(400).json({
        message: `${field} is required`,
        success: false,
      });
    }
  }

  next();
};

module.exports = loginPayloadExists;
