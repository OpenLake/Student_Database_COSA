
const { Room, RoomBooking, Event, User } = require('../models/schema');

exports.createRoom = async (req, res) => {
  try {
    const { name, capacity, location, amenities } = req.body;
    const room = new Room({ name, capacity, location, amenities });
    await room.save();
    res.status(201).json({ message: 'Room created', room });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: 'Room name already exists' });
    }
    res.status(500).json({ message: 'Error creating room', error: err.message });
  }
};


exports.getAllRooms = async (_req, res) => {
  try {
    const rooms = await Room.find({ is_active: true });
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching rooms' });
  }
};


exports.bookRoom = async (req, res) => {
  try {
    const { roomId, eventId, date, startTime, endTime, purpose } = req.body;
    // Check for clash
    const clash = await RoomBooking.findOne({
      room: roomId,
      status: { $in: ['Pending', 'Approved'] },
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
      ],
    });
    if (clash) {
      return res.status(409).json({ message: 'Room clash detected', conflictingBooking: clash });
    }
    const booking = new RoomBooking({
      room: roomId,
      event: eventId,
      date,
      startTime,
      endTime,
      purpose,
      bookedBy: req.user._id,
    });
    await booking.save();
    res.status(201).json({ message: 'Room booked (pending approval)', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error booking room', error: err.message });
  }
};


exports.getAvailability = async (req, res) => {
  try {
    const { date, roomId } = req.query;
    const query = { date: new Date(date) };
    if (roomId) query.room = roomId;
    const bookings = await RoomBooking.find(query).populate('room event bookedBy');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching availability' });
  }
};


exports.updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!['Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const booking = await RoomBooking.findByIdAndUpdate(
      id,
      { status, reviewedBy: req.user._id, updated_at: new Date() },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking status updated', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error updating booking status' });
  }
};


exports.cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await RoomBooking.findById(id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (
      String(booking.bookedBy) !== String(req.user._id) &&
      !['PRESIDENT', 'GENSEC_SCITECH', 'GENSEC_ACADEMIC', 'GENSEC_CULTURAL', 'GENSEC_SPORTS', 'CLUB_COORDINATOR'].includes(req.user.role)
    ) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    booking.status = 'Cancelled';
    booking.updated_at = new Date();
    await booking.save();
    res.json({ message: 'Booking cancelled', booking });
  } catch (err) {
    res.status(500).json({ message: 'Error cancelling booking' });
  }
};

exports.getBookings = async (req, res) => {
  try {
    const { roomId, date, status } = req.query;
    const query = {};
    if (roomId) query.room = roomId;
    if (date) query.date = new Date(date);
    if (status) query.status = status;
    const bookings = await RoomBooking.find(query).populate('room event bookedBy');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};
