const router = require("express").Router();
const c = require("../controllers/applicationController");
const { protect, authorize } = require("../middleware/auth");
router.get("/", protect, c.list);
router.get("/:id", protect, c.getOne);
router.post("/property/:propertyId", protect, authorize("tenant"), c.create);
router.patch("/:id/status", protect, authorize("owner"), c.updateStatus);
module.exports = router;
