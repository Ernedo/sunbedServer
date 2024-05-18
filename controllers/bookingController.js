const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const Sunbed = require('../models/Sunbed');

async function createBooking(req, res) {
  try {
    const form = req.body;
    const booking = new Booking(form);

    await booking.save();

    const sunbed = await Sunbed.findById(form.sunbedId);

    sunbed.dates.push(form.date);

    await sunbed.save();
    let restaurant=await Restaurant.findById(form.restaurantId).populate(`sunbeds`)
    res.status(201).json(restaurant);
  } catch (err) {
    console.error('Error creating booking:', err);
    res.status(400).json({ message: 'Failed to create booking' });
  }
}


async function getBookings(req, res) {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (err) {
    console.error('Error getting bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getBookingById(req, res) {
  const { id } = req.params;

  try {
    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(booking);
  } catch (err) {
    console.error('Error getting booking by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function updateBooking(req, res) {
  const { id } = req.params;
  const newData = req.body;

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(400).json({ message: 'Failed to update booking' });
  }
}


async function deleteBooking(req, res) {
  const { id } = req.params;

  try {
    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (deletedBooking) {
      const sunbed = await Sunbed.findById(deletedBooking.sunbedId);

      sunbed.dates = sunbed.dates.filter(date => date !== deletedBooking.date);

      await sunbed.save();

      res.status(200).json({ success: true }); 
    } else {
      res.status(404).json({ message: 'Booking not found', success: false }); 
    }
  } catch (err) {
    console.error('Error deleting booking:', err);
    res.status(500).json({ message: 'Internal server error' }); 
  }
}



async function getBookingsByRestaurantId(req, res) {
  const { restaurantId } = req.params;

  try {
    const bookings = await Booking.find({ restaurantId: restaurantId });
    res.json(bookings);
  } catch (err) {
    console.error('Error getting bookings by restaurant ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getBookingsBySunbedId(req, res) {
  const { sunbedId } = req.params;
  try {
    const bookings = await Booking.find({ sunbedId: sunbedId });
    res.json(bookings);
  } catch (err) {
    console.error('Error getting bookings by sunbed ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllSunbedBookingsByDate(req, res) {
  const { restaurantId, date } = req.params;

  try {
    const bookings = await Booking.find({ restaurantId: restaurantId, date: date });
    res.json(bookings);
  } catch (err) {
    console.error('Error getting all sunbed bookings by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = { createBooking, getBookings,getBookingById,getBookingsByRestaurantId,getAllSunbedBookingsByDate,getBookingsBySunbedId, updateBooking, deleteBooking };
