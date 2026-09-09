const r = require("express").Router();
const c = require("../controllers/reportController");
const { protect, authorize } = require("../middleware/auth");
r.get("/", protect, c.list);
r.post("/", protect, c.create);
r.patch("/:id", protect, authorize("admin"), c.update);
module.exports = r;
