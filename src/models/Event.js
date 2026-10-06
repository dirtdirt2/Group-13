const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required."],
      trim: true,
      minlength: [3, "Event title must be at least 3 characters."],
      maxlength: [150, "Event title cannot exceed 150 characters."]
    },
    description: {
      type: String,
      required: [true, "Event description is required."],
      trim: true,
      minlength: [10, "Event description must be at least 10 characters."],
      maxlength: [2000, "Event description cannot exceed 2000 characters."]
    },
    date: {
      type: Date,
      required: [true, "Event date is required."]
    },
    startTime: {
      type: String,
      required: [true, "Start time is required."],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "Start time must use HH:mm format."]
    },
    endTime: {
      type: String,
      required: [true, "End time is required."],
      match: [/^([01]\d|2[0-3]):[0-5]\d$/, "End time must use HH:mm format."]
    },
    location: {
      type: String,
      required: [true, "Event location is required."],
      trim: true,
      maxlength: [200, "Location cannot exceed 200 characters."]
    },
    category: {
      type: String,
      trim: true,
      maxlength: [80, "Category cannot exceed 80 characters."]
    },
    capacity: {
      type: Number,
      required: [true, "Event capacity is required."],
      min: [1, "Event capacity must be at least 1."],
      validate: {
        validator: Number.isInteger,
        message: "Event capacity must be a whole number."
      }
    },
    registeredCount: {
      type: Number,
      default: 0,
      min: [0, "Registered count cannot be negative."],
      validate: {
        validator: Number.isInteger,
        message: "Registered count must be a whole number."
      }
    }
  },
  {
    timestamps: true
  }
);

eventSchema.pre("validate", function (next) {
  if (this.registeredCount > this.capacity) {
    this.invalidate(
      "registeredCount",
      "Registered count cannot be greater than event capacity."
    );
  }

  if (this.endTime <= this.startTime) {
    this.invalidate(
      "endTime",
      "End time must be later than start time."
    );
  }

  next();
});

eventSchema.virtual("availableSlots").get(function () {
  return Math.max(this.capacity - this.registeredCount, 0);
});

eventSchema.set("toJSON", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
