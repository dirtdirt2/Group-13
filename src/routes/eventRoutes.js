const express = require("express");
const {
  getEvents,
  getEventById,
  searchEvents
} = require("../controllers/eventController");

const router = express.Router();

router.get("/search", searchEvents);
router.get("/", getEvents);
router.get("/:id", getEventById);

module.exports = router;
