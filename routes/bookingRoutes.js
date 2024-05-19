const express = require('express');
const {
  createBooking,
  getBookings,
  updateBooking,
  deleteBooking,
  getBookingById,
  getBookingsByRestaurantId,getBookingsBySunbedId,getAllSunbedBookingsByDate, reservationReport,getBookingDetailsByRandomId
} = require('../controllers/bookingController');
const authenticateToken = require('../middleware/authenticatetoken');

const router = express.Router();

router.post('/', createBooking);

router.get('/',authenticateToken, getBookings);
router.get('/search/:randomId', getBookingDetailsByRandomId);
router.get('/:id',authenticateToken, getBookingById);
router.get('/restaurant/:restaurantId',authenticateToken, getBookingsByRestaurantId);
router.post('/sunbed/:sunbedId',authenticateToken, getBookingsBySunbedId);
router.get('/:restaurantId/:date',authenticateToken, getAllSunbedBookingsByDate);

router.put('/:id',authenticateToken, updateBooking);

router.delete('/:id',authenticateToken, deleteBooking);
router.post('/reservationreport',authenticateToken, reservationReport);


module.exports = router;
