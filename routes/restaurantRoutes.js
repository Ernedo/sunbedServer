const express = require('express');
const { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant, getSunbedById, addSunbed,updateSunbed, deleteSunbed, getSunbedsByDate, getSunbedsByRestaurantId, getSunbedTypeById, getSunbedPriceById,getRestaurantById } = require('../controllers/restaurantController');
const authenticateToken= require(`../middleware/authenticatetoken`)
const router = express.Router();

router.post('/',authenticateToken, createRestaurant);

router.get('/', getRestaurants);

router.put('/:id',authenticateToken,updateRestaurant);

router.delete('/:id',authenticateToken, deleteRestaurant);

router.get('/:id', getRestaurantById);

router.get('/getrestaurantsunbeds/:id', getSunbedsByRestaurantId);

router.get('/getrestaurantsunbed/:restaurantId/:sunbedId', getSunbedById);

router.post('/sunbed/:id',authenticateToken,addSunbed);
router.put('/sunbed/:restaurantId/:sunbedId',authenticateToken, updateSunbed);

router.delete('/sunbed/:restaurantId/:sunbedId',authenticateToken, deleteSunbed);

router.get('/sunbeds/:restaurantId/:date', getSunbedsByDate);

router.get('/sunbedtype/:restaurantId/:sunbedId', getSunbedTypeById);

router.get('/sunbedprice/:restaurantId/:sunbedId', getSunbedPriceById);


module.exports = router;
