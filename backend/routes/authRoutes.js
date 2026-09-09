const router = require("express").Router();
const passport = require("passport");
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
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "http://localhost:5173/login",
  }),
  c.googleCallback
);
module.exports = router;
