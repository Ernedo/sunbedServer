const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const restaurantRoutes = require('./routes/restaurantRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');
const paypal = require('./controllers/paymentController')
// const paypalRoutes = require('./routes/paypalRoutes');
const app = express();
app.use(cors({
  origin: '*', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to send cookies or HTTP authentication
}));
app.use(cookieParser());
app.use(bodyParser.json());


mongoose.connect('mongodb+srv://ernedoselami:1Kiy9Qe2QxrHaKNE@cluster0.de0yfwx.mongodb.net/Sunbed?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/bookings', bookingRoutes);
// app.use('/paypal', paypalRoutes);
app.post('/pay', async (req, res) => {
  try {

    const url = await paypal.createOrder(req.query.amount)
    console.log(url);
    res.redirect(url)
  } catch (error) {
    res.send('Error: ' + error)
  }
})

app.get('/complete-order', async (req, res) => {
  try {
    const response = await paypal.capturePayment(req.query.token)
    res.status(200).json({ message: 'Sunbed Reserved' })
  } catch (error) {
    res.send('Error: ' + error)
  }
})

app.get('/cancel-order', (req, res) => {
  res.redirect('/')
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


