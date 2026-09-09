function required(fields) {
  return (req, res, next) => {
    const missing = fields.filter(
      (f) =>
        req.body[f] === undefined || req.body[f] === null || req.body[f] === "",
    );
    if (missing.length)
      return res
        .status(400)
        .json({ message: "Missing required fields", fields: missing });
    next();
  };
}
module.exports = { required };
