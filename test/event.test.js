const assert = require("node:assert/strict");
const test = require("node:test");
const Event = require("../src/models/Event");
const { getEvents, searchEvents } = require("../src/controllers/eventController");

function createEvent(overrides = {}) {
  return new Event({
    title: "Bicol Music Festival",
    description: "A local music event with live performances.",
    date: new Date("2026-11-20T00:00:00.000Z"),
    startTime: "18:00",
    endTime: "21:00",
    location: "Naga City",
    category: "Music",
    capacity: 100,
    registeredCount: 0,
    ...overrides
  });
}

function createResponse() {
  const response = {};
  return {
    response,
    res: {
      status(code) {
        response.statusCode = code;
        return this;
      },
      json(body) {
        response.body = body;
        return this;
      }
    }
  };
}

test("accepts valid HH:mm event times", async () => {
  await assert.doesNotReject(createEvent().validate());
});

test("rejects malformed event times", async () => {
  const event = createEvent({ startTime: "6:00" });

  await assert.rejects(event.validate(), (error) => {
    assert.match(error.errors.startTime.message, /HH:mm/);
    return true;
  });
});

test("rejects an end time that is not later than the start time", async () => {
  const event = createEvent({ startTime: "21:00", endTime: "21:00" });

  await assert.rejects(event.validate(), (error) => {
    assert.match(error.errors.endTime.message, /later than start time/);
    return true;
  });
});

test("enforces whole-number capacity and registration limits", async () => {
  const event = createEvent({ capacity: 2.5, registeredCount: 3 });

  await assert.rejects(event.validate(), (error) => {
    assert.match(error.errors.capacity.message, /whole number/);
    assert.match(error.errors.registeredCount.message, /greater than event capacity/);
    return true;
  });
});

test("computes available slots from event capacity", () => {
  assert.equal(createEvent({ capacity: 100, registeredCount: 35 }).availableSlots, 65);
});

test("lists upcoming events with pagination and computed availability", async () => {
  const originalFind = Event.find;
  const originalCountDocuments = Event.countDocuments;
  let filter;
  let skipped;
  let limited;

  const query = {
    sort() {
      return this;
    },
    skip(value) {
      skipped = value;
      return this;
    },
    limit(value) {
      limited = value;
      return Promise.resolve([createEvent({ registeredCount: 35 })]);
    }
  };

  Event.find = (queryFilter) => {
    filter = queryFilter;
    return query;
  };
  Event.countDocuments = async (queryFilter) => {
    assert.equal(queryFilter, filter);
    return 12;
  };

  try {
    const { response, res } = createResponse();
    await getEvents(
      { query: { page: "2", limit: "5", upcoming: "true" } },
      res,
      (error) => {
        throw error;
      }
    );

    assert.ok(filter.date.$gte instanceof Date);
    assert.equal(skipped, 5);
    assert.equal(limited, 5);
    assert.deepEqual(response.body.pagination, {
      page: 2,
      limit: 5,
      total: 12,
      totalPages: 3
    });
    assert.equal(response.body.data[0].availableSlots, 65);
  } finally {
    Event.find = originalFind;
    Event.countDocuments = originalCountDocuments;
  }
});

test("search treats regex metacharacters as literal text", async () => {
  const originalFind = Event.find;
  let filter;

  Event.find = (query) => {
    filter = query;
    return {
      sort: async () => [createEvent({ registeredCount: 35 })]
    };
  };

  try {
    const { response, res } = createResponse();

    await searchEvents({ query: { q: "[music].*" } }, res, (error) => {
      throw error;
    });

    const regex = filter.$or[0].title;
    assert.equal(response.statusCode, 200);
    assert.equal(regex.test("[music].*"), true);
    assert.equal(regex.test("music"), false);
    assert.equal(response.body.data[0].availableSlots, 65);
  } finally {
    Event.find = originalFind;
  }
});
