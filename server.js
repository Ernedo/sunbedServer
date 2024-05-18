const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const cookieParser = require('cookie-parser');
const restaurantRoutes = require('./routes/restaurantRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const cors = require('cors');
const { paypalPayment, capturePayment } = require('./controllers/paymentController');
const paypal = require('paypal-rest-sdk');
const app = express();
app.use(cors({
  origin: 'https://sunbed.al', // Replace with your frontend URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, // If you need to send cookies or HTTP authentication
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb+srv://hamzahashmi:admin@sunbed.9nqn1h7.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

app.use('/auth', authRoutes);
app.use('/restaurants', restaurantRoutes);
app.use('/bookings', bookingRoutes);

app.post('/pay', async (req, res) => {
  try {
    const url = await paypalPayment()
    res.redirect(url)
    console.log(url);
  } catch (error) {
    res.send('Error: ' + error)
  }
});

app.get('/success', async (req, res) => {
  try {
    
    const data = await capturePayment(req.query.token)
    console.log(data);
    res.send(data)
  } catch (error) {
    res.send('Error: ' + error)
  }
})
app.get('/cancel', (req, res) => res.send('Cancelled'));
app.get('/',(req,res)=> res.send("server working"));
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
