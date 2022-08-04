const registerPayloadExists = (req, res, next) => {
  const requiredFields = [
    "firstname",
    "lastname",
    "username",
    "password",
    "email",
  ];

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

module.exports = registerPayloadExists;
