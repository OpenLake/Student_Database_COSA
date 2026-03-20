const mongoose = require("mongoose");
const { Room, RoomBooking, Event } = require("../models/schema");
const { ROLES } = require("../utils/roles");

const ADMIN_ROLES = [
  ROLES.PRESIDENT,
  ROLES.GENSEC_SCITECH,
  ROLES.GENSEC_ACADEMIC,
  ROLES.GENSEC_CULTURAL,
  ROLES.GENSEC_SPORTS,
  ROLES.CLUB_COORDINATOR,
];

const SAFE_USER_SELECT = "_id username role personal_info.name";
const SAFE_EVENT_SELECT = "_id title";
const SAFE_ROOM_SELECT =
  "_id room_id name location capacity allowed_roles is_active";
const SAFE_ROOM_DETAIL_SELECT = `${SAFE_ROOM_SELECT} amenities`;

const getRoomVenueCandidates = (room) => {
  const candidates = [
    room && room.name,
    room && room.room_id,
    room && room.location,
  ]
    .map((value) => (value ? String(value).trim() : ""))
    .filter(Boolean);
  return Array.from(new Set(candidates));
};

const findOverlappingEvent = async ({
  session,
  venueCandidates,
  start,
  end,
  excludeEventId,
}) => {
  if (!venueCandidates || venueCandidates.length === 0) {
    return null;
  }

  const eventClashQuery = {
    status: { $ne: "cancelled" },
    "schedule.cancelled": { $ne: true },
    "schedule.venue": { $in: venueCandidates },
    "schedule.start": { $lt: end },
    "schedule.end": { $gt: start },
  };

  if (excludeEventId && mongoose.isValidObjectId(excludeEventId)) {
    eventClashQuery._id = { $ne: excludeEventId };
  }

  return Event.findOne(eventClashQuery)
    .session(session)
    .select(`${SAFE_EVENT_SELECT} schedule.start schedule.end schedule.venue`)
    .lean();
};

const getDayBounds = (dateInput) => {
  const parsedDate = new Date(dateInput);
  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  const dayStart = new Date(parsedDate);
  dayStart.setHours(0, 0, 0, 0);

  const dayEnd = new Date(dayStart);
  dayEnd.setDate(dayEnd.getDate() + 1);

  return { dayStart, dayEnd };
};

const isSameCalendarDay = (leftDate, rightDate) => {
  return (
    leftDate.getFullYear() === rightDate.getFullYear() &&
    leftDate.getMonth() === rightDate.getMonth() &&
    leftDate.getDate() === rightDate.getDate()
  );
};

const getRoomObjectId = async (roomIdentifier) => {
  if (!roomIdentifier) {
    return null;
  }

  if (mongoose.isValidObjectId(roomIdentifier)) {
    const room = await Room.findOne({
      $or: [{ _id: roomIdentifier }, { room_id: roomIdentifier }],
    })
      .select("_id")
      .lean();
    return room ? room._id : null;
  }

  const room = await Room.findOne({ room_id: roomIdentifier })
    .select("_id")
    .lean();
  return room ? room._id : null;
};

const buildRoomStatusMap = async (roomIds) => {
  if (!roomIds || roomIds.length === 0) {
    return new Map();
  }

  const now = new Date();

  const activeBookings = await RoomBooking.find({
    room: { $in: roomIds },
    status: "Approved",
    startTime: { $lte: now },
    endTime: { $gt: now },
  })
    .populate("event", SAFE_EVENT_SELECT)
    .select("room event startTime endTime")
    .lean();

  const statusMap = new Map();

  for (const booking of activeBookings) {
    const roomKey = String(booking.room);
    if (!statusMap.has(roomKey)) {
      statusMap.set(roomKey, {
        status: "occupied",
        current_event: booking.event || null,
        occupied_from: booking.startTime,
        occupied_until: booking.endTime,
      });
    }
  }

  const rooms = await Room.find({ _id: { $in: roomIds } })
    .select("_id room_id name location")
    .lean();

  const venueToRoomId = new Map();
  for (const room of rooms) {
    if (room.name) {
      venueToRoomId.set(room.name, String(room._id));
    }
    if (room.room_id) {
      venueToRoomId.set(room.room_id, String(room._id));
    }
    if (room.location) {
      venueToRoomId.set(room.location, String(room._id));
    }
  }

  const venueCandidates = Array.from(venueToRoomId.keys());
  if (venueCandidates.length > 0) {
    const activeEvents = await Event.find({
      status: { $ne: "cancelled" },
      "schedule.cancelled": { $ne: true },
      "schedule.start": { $lte: now },
      "schedule.end": { $gt: now },
      "schedule.venue": { $in: venueCandidates },
    })
      .select(`${SAFE_EVENT_SELECT} schedule.start schedule.end schedule.venue`)
      .lean();

    for (const event of activeEvents) {
      const roomKey = venueToRoomId.get(event.schedule && event.schedule.venue);
      if (!roomKey || statusMap.has(roomKey)) {
        continue;
      }

      statusMap.set(roomKey, {
        status: "occupied",
        current_event: {
          _id: event._id,
          title: event.title,
        },
        occupied_from: event.schedule ? event.schedule.start : null,
        occupied_until: event.schedule ? event.schedule.end : null,
      });
    }
  }

  return statusMap;
};

const enrichRoom = (room, statusMap) => {
  const activeStatus = statusMap.get(String(room._id));
  return Object.assign({}, room, {
    status: activeStatus ? activeStatus.status : "vacant",
    current_event: activeStatus ? activeStatus.current_event : null,
    occupied_until: activeStatus ? activeStatus.occupied_until : null,
  });
};

exports.createRoom = async (req, res) => {
  try {
    const { name, capacity, location, amenities, room_id, allowed_roles } =
      req.body;

    const numericCapacity = Number(capacity);
    if (!Number.isFinite(numericCapacity) || numericCapacity <= 0) {
      return res
        .status(400)
        .json({ message: "Capacity must be a positive number." });
    }

    if (!name || !location) {
      return res
        .status(400)
        .json({ message: "Name and location are required." });
    }

    const allowedRoleSet = new Set([...Object.values(ROLES), "STUDENT"]);
    if (allowed_roles && !Array.isArray(allowed_roles)) {
      return res
        .status(400)
        .json({ message: "allowed_roles must be an array." });
    }

    if (
      Array.isArray(allowed_roles) &&
      allowed_roles.some((role) => !allowedRoleSet.has(role))
    ) {
      return res
        .status(400)
        .json({ message: "allowed_roles contains invalid role values." });
    }

    const room = new Room({
      room_id,
      name: name.trim(),
      capacity: numericCapacity,
      location: location.trim(),
      amenities: Array.isArray(amenities)
        ? amenities.map((item) => String(item).trim()).filter(Boolean)
        : [],
      allowed_roles,
    });

    await room.save();
    const roomObject = room.toObject();
    res.status(201).json({
      message: "Room created",
      room: Object.assign({}, roomObject, {
        status: "vacant",
        current_event: null,
        occupied_until: null,
      }),
    });
  } catch (err) {
    if (err.code === 11000) {
      return res
        .status(409)
        .json({ message: "Room name or room_id already exists." });
    }
    res
      .status(500)
      .json({ message: "Error creating room", error: err.message });
  }
};

exports.getAllRooms = async (_req, res) => {
  try {
    const rooms = await Room.find({ is_active: true })
      .select(SAFE_ROOM_SELECT)
      .lean();
    const roomIds = rooms.map((room) => room._id);
    const statusMap = await buildRoomStatusMap(roomIds);

    res.json(rooms.map((room) => enrichRoom(room, statusMap)));
  } catch (err) {
    res.status(500).json({ message: "Error fetching rooms" });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const { room_id } = req.params;
    const roomObjectId = await getRoomObjectId(room_id);

    if (!roomObjectId) {
      return res.status(404).json({ message: "Room not found" });
    }

    const room = await Room.findById(roomObjectId)
      .select(SAFE_ROOM_DETAIL_SELECT)
      .lean();
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const statusMap = await buildRoomStatusMap([room._id]);
    const roomSummary = enrichRoom(room, statusMap);
    const activeStatus = statusMap.get(String(room._id));

    const detailPayload = {
      room_id: room.room_id,
      name: room.name,
      location: room.location,
      allowed_roles: room.allowed_roles,
      is_active: room.is_active,
      status: roomSummary.status,
      current_event: roomSummary.current_event,
      occupied_until: roomSummary.occupied_until,
      schedule: {
        start: activeStatus ? activeStatus.occupied_from || null : null,
        end: activeStatus ? activeStatus.occupied_until || null : null,
      },
      metadata: {
        capacity: room.capacity,
        features: Array.isArray(room.amenities) ? room.amenities : [],
      },
    };

    res.json(detailPayload);
  } catch (err) {
    res.status(500).json({ message: "Error fetching room details" });
  }
};

exports.bookRoom = async (req, res) => {
  try {
    const { roomId, eventId, date, startTime, endTime, purpose } = req.body;

    if (!roomId || !startTime || !endTime) {
      return res
        .status(400)
        .json({ message: "roomId, startTime and endTime are required." });
    }

    const parsedStartTime = new Date(startTime);
    const parsedEndTime = new Date(endTime);
    if (
      Number.isNaN(parsedStartTime.getTime()) ||
      Number.isNaN(parsedEndTime.getTime())
    ) {
      return res
        .status(400)
        .json({ message: "Invalid startTime or endTime format." });
    }

    if (parsedStartTime >= parsedEndTime) {
      return res
        .status(400)
        .json({ message: "startTime must be before endTime." });
    }

    const dayBounds = getDayBounds(date || parsedStartTime);
    if (!dayBounds) {
      return res.status(400).json({ message: "Invalid booking date." });
    }

    if (
      !isSameCalendarDay(parsedStartTime, dayBounds.dayStart) ||
      !isSameCalendarDay(parsedEndTime, dayBounds.dayStart)
    ) {
      return res
        .status(400)
        .json({ message: "Booking must start and end on the same date." });
    }

    const roomObjectId = await getRoomObjectId(roomId);
    if (!roomObjectId) {
      return res.status(404).json({ message: "Room not found or inactive." });
    }

    const room = await Room.findById(roomObjectId).lean();
    if (!room || !room.is_active) {
      return res.status(404).json({ message: "Room not found or inactive." });
    }

    const venueCandidates = getRoomVenueCandidates(room);

    if (
      Array.isArray(room.allowed_roles) &&
      room.allowed_roles.length > 0 &&
      !room.allowed_roles.includes(req.user.role)
    ) {
      return res
        .status(403)
        .json({ message: "Your role is not allowed to book this room." });
    }

    if (eventId) {
      if (!mongoose.isValidObjectId(eventId)) {
        return res.status(400).json({ message: "Invalid eventId provided." });
      }

      const eventExists = await Event.exists({ _id: eventId });
      if (!eventExists) {
        return res.status(400).json({ message: "Invalid eventId provided." });
      }
    }

    const session = await mongoose.startSession();
    let createdBookingId;

    try {
      await session.withTransaction(async () => {
        await Room.updateOne(
          { _id: roomObjectId },
          { $set: { updated_at: new Date() } },
          { session },
        );

        const clash = await RoomBooking.findOne({
          room: roomObjectId,
          status: { $in: ["Pending", "Approved"] },
          date: { $gte: dayBounds.dayStart, $lt: dayBounds.dayEnd },
          startTime: { $lt: parsedEndTime },
          endTime: { $gt: parsedStartTime },
        })
          .session(session)
          .select("_id room event startTime endTime status")
          .lean();

        if (clash) {
          const conflictError = new Error("Room clash detected");
          conflictError.statusCode = 409;
          conflictError.conflictingBooking = clash;
          throw conflictError;
        }

        const overlappingEvent = await findOverlappingEvent({
          session,
          venueCandidates,
          start: parsedStartTime,
          end: parsedEndTime,
          excludeEventId: eventId,
        });

        if (overlappingEvent) {
          const eventConflictError = new Error("Room clash detected");
          eventConflictError.statusCode = 409;
          eventConflictError.conflictingEvent = overlappingEvent;
          throw eventConflictError;
        }

        const createdBookings = await RoomBooking.create(
          [
            {
              room: roomObjectId,
              event: eventId || undefined,
              date: dayBounds.dayStart,
              startTime: parsedStartTime,
              endTime: parsedEndTime,
              purpose,
              bookedBy: req.user._id,
            },
          ],
          { session },
        );

        createdBookingId = createdBookings[0]._id;
      });
    } catch (error) {
      if (error.statusCode === 409) {
        return res.status(409).json({
          message: error.message,
          conflictingBooking: error.conflictingBooking,
          conflictingEvent: error.conflictingEvent,
        });
      }
      throw error;
    } finally {
      await session.endSession();
    }

    const responseBooking = await RoomBooking.findById(createdBookingId)
      .populate("room", SAFE_ROOM_SELECT)
      .populate("event", SAFE_EVENT_SELECT)
      .populate("bookedBy", SAFE_USER_SELECT)
      .lean();

    res.status(201).json({
      message: "Room booked (pending approval)",
      booking: responseBooking,
    });
  } catch (err) {
    res.status(500).json({ message: "Error booking room", error: err.message });
  }
};

exports.getAvailability = async (req, res) => {
  try {
    const { date, roomId } = req.query;
    const dayBounds = getDayBounds(date);

    if (!dayBounds) {
      return res
        .status(400)
        .json({ message: "A valid date query parameter is required." });
    }

    const query = {
      date: { $gte: dayBounds.dayStart, $lt: dayBounds.dayEnd },
    };

    if (roomId) {
      const roomObjectId = await getRoomObjectId(roomId);
      if (!roomObjectId) {
        return res.status(404).json({ message: "Room not found" });
      }
      query.room = roomObjectId;
    }

    const bookings = await RoomBooking.find(query)
      .sort({ startTime: 1 })
      .populate("room", SAFE_ROOM_SELECT)
      .populate("event", SAFE_EVENT_SELECT)
      .populate("bookedBy", SAFE_USER_SELECT)
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching availability" });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const session = await mongoose.startSession();
    let reviewedBookingId;

    try {
      await session.withTransaction(async () => {
        const booking = await RoomBooking.findById(id).session(session);
        if (!booking) {
          const notFoundError = new Error("Booking not found");
          notFoundError.statusCode = 404;
          throw notFoundError;
        }

        if (booking.status !== "Pending") {
          const invalidStateError = new Error(
            "Only pending bookings can be reviewed.",
          );
          invalidStateError.statusCode = 409;
          throw invalidStateError;
        }

        if (status === "Approved") {
          if (!(booking.startTime < booking.endTime)) {
            const invalidTimeError = new Error(
              "Invalid booking time range for approval.",
            );
            invalidTimeError.statusCode = 400;
            throw invalidTimeError;
          }

          await Room.updateOne(
            { _id: booking.room },
            { $set: { updated_at: new Date() } },
            { session },
          );

          const roomForBooking = await Room.findById(booking.room)
            .session(session)
            .select("name room_id location")
            .lean();

          if (!roomForBooking) {
            const missingRoomError = new Error("Room not found or inactive.");
            missingRoomError.statusCode = 404;
            throw missingRoomError;
          }

          const venueCandidates = getRoomVenueCandidates(roomForBooking);

          const dayBounds = getDayBounds(booking.date);
          const overlappingApprovedBooking = await RoomBooking.findOne({
            _id: { $ne: booking._id },
            room: booking.room,
            status: "Approved",
            date: { $gte: dayBounds.dayStart, $lt: dayBounds.dayEnd },
            startTime: { $lt: booking.endTime },
            endTime: { $gt: booking.startTime },
          })
            .session(session)
            .select("_id room event startTime endTime")
            .lean();

          if (overlappingApprovedBooking) {
            const conflictError = new Error(
              "Cannot approve booking due to overlap with another approved booking.",
            );
            conflictError.statusCode = 409;
            conflictError.conflictingBooking = overlappingApprovedBooking;
            throw conflictError;
          }

          const overlappingEvent = await findOverlappingEvent({
            session,
            venueCandidates,
            start: booking.startTime,
            end: booking.endTime,
            excludeEventId: booking.event,
          });

          if (overlappingEvent) {
            const eventConflictError = new Error(
              "Cannot approve booking due to overlap with another event.",
            );
            eventConflictError.statusCode = 409;
            eventConflictError.conflictingEvent = overlappingEvent;
            throw eventConflictError;
          }
        }

        booking.status = status;
        booking.reviewedBy = req.user._id;
        booking.updated_at = new Date();
        await booking.save({ session });
        reviewedBookingId = booking._id;
      });
    } catch (error) {
      if (error.statusCode) {
        return res.status(error.statusCode).json({
          message: error.message,
          conflictingBooking: error.conflictingBooking,
          conflictingEvent: error.conflictingEvent,
        });
      }
      throw error;
    } finally {
      await session.endSession();
    }

    const responseBooking = await RoomBooking.findById(reviewedBookingId)
      .populate("room", SAFE_ROOM_SELECT)
      .populate("event", SAFE_EVENT_SELECT)
      .populate("bookedBy", SAFE_USER_SELECT)
      .populate("reviewedBy", SAFE_USER_SELECT)
      .lean();

    res.json({ message: "Booking status updated", booking: responseBooking });
  } catch (err) {
    res.status(500).json({ message: "Error updating booking status" });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: "Invalid booking id" });
    }

    const booking = await RoomBooking.findById(id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      String(booking.bookedBy) !== String(req.user._id) &&
      !ADMIN_ROLES.includes(req.user.role)
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    booking.status = "Cancelled";
    booking.updated_at = new Date();
    await booking.save();

    const responseBooking = await RoomBooking.findById(booking._id)
      .populate("room", SAFE_ROOM_SELECT)
      .populate("event", SAFE_EVENT_SELECT)
      .populate("bookedBy", SAFE_USER_SELECT)
      .lean();

    res.json({ message: "Booking cancelled", booking: responseBooking });
  } catch (err) {
    res.status(500).json({ message: "Error cancelling booking" });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { roomId, date, status } = req.query;
    const query = {};

    if (roomId) {
      const roomObjectId = await getRoomObjectId(roomId);
      if (!roomObjectId) {
        return res.status(404).json({ message: "Room not found" });
      }
      query.room = roomObjectId;
    }

    if (date) {
      const dayBounds = getDayBounds(date);
      if (!dayBounds) {
        return res
          .status(400)
          .json({ message: "Invalid date query parameter." });
      }
      query.date = { $gte: dayBounds.dayStart, $lt: dayBounds.dayEnd };
    }

    if (status) {
      const allowedStatuses = ["Pending", "Approved", "Rejected", "Cancelled"];
      if (!allowedStatuses.includes(status)) {
        return res.status(400).json({ message: "Invalid status filter." });
      }
      query.status = status;
    }

    const bookings = await RoomBooking.find(query)
      .sort({ startTime: 1 })
      .populate("room", SAFE_ROOM_SELECT)
      .populate("event", SAFE_EVENT_SELECT)
      .populate("bookedBy", SAFE_USER_SELECT)
      .populate("reviewedBy", SAFE_USER_SELECT)
      .lean();

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};
