const r = require("express").Router();
const c = require("../controllers/reviewController");
const { protect } = require("../middleware/auth");
r.post("/", protect, c.create);
r.get("/property/:propertyId", c.list);
r.delete("/:id", protect, c.remove);
module.exports = r;
