const bodyPayloadExists = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({
      message: "No given data",
      success: false,
    });
  }

  next();
};

module.exports = bodyPayloadExists;
