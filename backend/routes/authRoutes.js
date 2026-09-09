const router = require("express").Router();
const c = require("../controllers/authController");
const { protect } = require("../middleware/auth");
router.post("/register", c.register);
router.post("/login", c.login);
router.post("/forgot-password", c.forgotPassword);
router.post("/reset-password/:token", c.resetPassword);
router.get("/me", protect, c.me);
router.post("/logout", protect, (req, res) =>
  res.json({ message: "Logout successful. Remove the JWT on client." }),
);
module.exports = router;
