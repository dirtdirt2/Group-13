const mongoose = require("mongoose");
const Event = require("../models/Event");

function eventResponse(event) {
  return event.toJSON();
}

async function getEvents(req, res, next) {
  try {
    const page = Math.max(Number.parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(Number.parseInt(req.query.limit, 10) || 10, 1),
      100
    );

    const filter = {};

    if (req.query.upcoming === "true") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      filter.date = { $gte: today };
    }

    const [events, total] = await Promise.all([
      Event.find(filter)
        .sort({ date: 1, startTime: 1 })
        .skip((page - 1) * limit)
        .limit(limit),
      Event.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      data: events.map(eventResponse),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
}

async function getEventById(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid event ID."
      });
    }

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found."
      });
    }

    res.status(200).json({
      success: true,
      data: eventResponse(event)
    });
  } catch (error) {
    next(error);
  }
}

async function searchEvents(req, res, next) {
  try {
    const q = String(req.query.q || "").trim();

    if (!q) {
      return res.status(400).json({
        success: false,
        message: "Search query 'q' is required."
      });
    }

    const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");

    const events = await Event.find({
      $or: [
        { title: regex },
        { description: regex },
        { location: regex },
        { category: regex }
      ]
    }).sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events.map(eventResponse)
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getEvents,
  getEventById,
  searchEvents
};
