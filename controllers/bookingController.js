const Booking = require('../models/Booking');
const Restaurant = require('../models/Restaurant');
const Sunbed = require('../models/Sunbed');
const User = require('../models/user');

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
  const {newPaymentStatus} = req.body;
  try {
    console.log(newPaymentStatus)
    const updatedBooking = await Booking.findByIdAndUpdate(id, {payment:newPaymentStatus}, { new: true });
    res.json(updatedBooking);
  } catch (err) {
    console.error('Error updating booking:', err);
    res.status(400).json({ message: 'Failed to update booking' });
  }
}
async function updateBookingPayment(req, res) {
  const { restaurantId,sunbedId } = req.params;
  const {newPaymentStatus} = req.body;
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
async function getBookingDetailsByRandomId(req, res) {
  const { randomId } = req.params;
  try {
    const booking = await Booking.findOne({ randomId });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (err) {
    console.error('Error getting sunbed bookings:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function reservationReport(req, res) {
  try {
    const { minDate, maxDate } = req.body;
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurants = await Restaurant.find({ owner: userId });
    if (!restaurants || restaurants.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    let countCircle = 0;
    let countSquare = 0;
    let countSquareV = 0;
    let totalPriceCircle = 0;
    let totalPriceSquare = 0;
    let totalPriceSquareV = 0;

    let countCircleAdmin = 0;
    let countSquareAdmin = 0;
    let countSquareVAdmin = 0;
    let totalPriceCircleAdmin = 0;
    let totalPriceSquareAdmin = 0;
    let totalPriceSquareVAdmin = 0;

    for (const restaurant of restaurants) {
      let bookings = await Booking.find({ restaurantId: restaurant._id });
      bookings = bookings.filter(booking => booking.date >= minDate && booking.date <= maxDate);

      for (const booking of bookings) {
        let sunbed = await Sunbed.findById(booking.sunbedId);
        if (booking.isAdmin) {
          if (sunbed.type === 'circle') {
            countCircleAdmin++;
            totalPriceCircleAdmin += parseFloat(sunbed.price);
          } else if (sunbed.type === 'square') {
            countSquareAdmin++;
            totalPriceSquareAdmin += parseFloat(sunbed.price);
          } else if (sunbed.type === 'squarev') {
            countSquareVAdmin++;
            totalPriceSquareVAdmin += parseFloat(sunbed.price);
          }
        } else {
          if (sunbed.type === 'circle') {
            countCircle++;
            totalPriceCircle += parseFloat(sunbed.price);
          } else if (sunbed.type === 'square') {
            countSquare++;
            totalPriceSquare += parseFloat(sunbed.price);
          } else if (sunbed.type === 'squarev') {
            countSquareV++;
            totalPriceSquareV += parseFloat(sunbed.price);
          }
        }
      }
    }
    res.status(200).json( {    countCircle,
      countSquare,
      countSquareV,
      totalPriceCircle,
      totalPriceSquare,
      totalPriceSquareV,
      countCircleAdmin,
      countSquareAdmin,
      countSquareVAdmin,
      totalPriceCircleAdmin,
      totalPriceSquareAdmin,
      totalPriceSquareVAdmin})
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}
module.exports = { createBooking, getBookingDetailsByRandomId,reservationReport,updateBookingPayment,getBookings,getBookingById,getBookingsByRestaurantId,getAllSunbedBookingsByDate,getBookingsBySunbedId, updateBooking, deleteBooking };
