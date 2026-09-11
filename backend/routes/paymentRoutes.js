const r = require("express").Router();
const c = require("../controllers/paymentController");
const { protect, authorize } = require("../middleware/auth");
r.get("/", protect, c.list);
r.get("/owner/earnings", protect, authorize("owner"), c.ownerEarnings);
r.post("/order", protect, c.createOrder);
r.post("/verify", protect, c.verify);
r.get("/:id", protect, c.getOne);
r.post("/", protect, c.create);
r.patch("/:id", protect, c.update);

module.exports = r;
