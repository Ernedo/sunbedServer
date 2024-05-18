const Restaurant = require('../models/Restaurant');
const Sunbed = require('../models/Sunbed');
const User = require('../models/User');


async function createRestaurant(req, res) {
  const  restaurantData  = req.body;

  try {
    // Create sunbed documents
    const sunbeds = await Sunbed.insertMany(restaurantData.sunbeds);

    // Extract ObjectId values from the created sunbeds
    const sunbedIds = sunbeds.map(sunbed => sunbed._id);

    // Replace sunbeds in restaurantData with their ObjectId values
    restaurantData.sunbeds = sunbedIds;

    const newRestaurant = await Restaurant.create(restaurantData);
    res.status(201).json(newRestaurant);
  } catch (err) {
    console.error('Error creating restaurant:', err.message, err.stack);
    res.status(400).json({ message: 'Failed to create restaurant', error: err.message });
  }
}


async function getRestaurants(req, res) {
  try {
    const restaurants = await Restaurant.find().populate('sunbeds');
    res.json(restaurants);
  } catch (err) {
    console.error('Error getting restaurants:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateRestaurant(req, res) {
  const { id } = req.params;
  let {data} = req.body;
  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this restaurant' });
    }

    // Update the restaurant
    const updatedRestaurant = await Restaurant.findByIdAndUpdate(id, data, { new: true }).populate(`sunbeds`);
    res.json(updatedRestaurant);
  } catch (err) {
    console.error('Error updating restaurant:', err);
    res.status(400).json({ message: 'Failed to update restaurant' });
  }
}


async function deleteRestaurant(req, res) {
  const { id } = req.params;
  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this restaurant' });
    }
    const deletedRestaurant = await Restaurant.findByIdAndDelete(id);
    res.json(deletedRestaurant);
  } catch (err) {
    console.error('Error deleting restaurant:', err);
    res.status(400).json({ message: 'Failed to delete restaurant' });
  }
}

async function getRestaurantById(req, res) {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id).populate(`sunbeds`);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (err) {
    console.error('Error getting restaurant by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}



async function addSunbed(req, res) {
  const { id } = req.params;
  const {data} = req.body;

  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this restaurant' });
    }

    const newSunbed = new Sunbed(data);
    await newSunbed.save();

    restaurant.sunbeds.push(newSunbed._id);
    await restaurant.save();
    let updatedrestaurant= await Restaurant.findById(id).populate(`sunbeds`)
    res.status(201).json(updatedrestaurant);
  } catch (err) {
    console.error('Error adding sunbed:', err);
    res.status(400).json({ message: 'Failed to add sunbed' });
  }
}

async function getSunbedById(req, res) {
  const { restaurantId, sunbedId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    const sunbed = restaurant.sunbeds.find(sunbed => sunbed._id.toString() === sunbedId);
    if (!sunbed) {
      return res.status(404).json({ message: 'Sunbed not found' });
    }
    
    res.json(sunbed);
  } catch (err) {
    console.error('Error getting sunbed by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateSunbed(req, res) {
  const { restaurantId, sunbedId } = req.params;
  const {newData} = req.body;

  try {
    console.log(newData)
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this restaurant' });
    }
    const sunbed = await Sunbed.findById(sunbedId);
    if (!sunbed) {
      return res.status(404).json({ message: 'Sunbed not found' });
    }
    const updatedSunbed = await Sunbed.findByIdAndUpdate(
      sunbedId,
      newData,
      { new: true }
    );
    if (!updatedSunbed) {
      return res.status(404).json({ message: 'Sunbed not found' });
    }
    const updatedRestaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    console.error('Error updating sunbed:', err);
    res.status(400).json({ message: 'Failed to update sunbed' });
  }
}

async function deleteSunbed(req, res) {
  const { restaurantId, sunbedId } = req.params;

  try {
    const userId = req.user;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    if (restaurant.owner.toString() !== userId) {
      return res.status(403).json({ message: 'You do not have permission to update this restaurant' });
    }
    restaurant.sunbeds.pull(sunbedId); 
    await restaurant.save();
    await Sunbed.findByIdAndDelete(sunbedId);
    const updatedRestaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    res.status(200).json(updatedRestaurant);
  } catch (err) {
    console.error('Error deleting sunbed:', err);
    res.status(400).json({ message: 'Failed to delete sunbed' });
  }
}

async function getSunbedsByDate(req, res) {
  const { restaurantId, date } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const sunbeds = restaurant.sunbeds.map(sunbed => ({
      ...sunbed.toObject(),
      reserved: sunbed.dates.includes(date)
    }));
    
    res.json(sunbeds);
  } catch (err) {
    console.error('Error getting sunbeds by date:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


async function getSunbedsByRestaurantId(req, res) {
  const { id } = req.params;

  try {
    const restaurant = await Restaurant.findById(id).populate('sunbeds');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const sunbeds = restaurant.sunbeds;
    res.json(sunbeds);
  } catch (err) {
    console.error('Error getting sunbeds by restaurant ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getSunbedTypeById(req, res) {
  const { restaurantId, sunbedId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const sunbed = restaurant.sunbeds.find(sunbed => sunbed._id.toString() === sunbedId);
    if (!sunbed) {
      return res.status(404).json({ message: 'Sunbed not found' });
    }

    const sunbedType = sunbed.type;
    res.json({ type: sunbedType });
  } catch (err) {
    console.error('Error getting sunbed type by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getSunbedPriceById(req, res) {
  const { restaurantId, sunbedId } = req.params;

  try {
    const restaurant = await Restaurant.findById(restaurantId).populate('sunbeds');
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const sunbed = restaurant.sunbeds.find(sunbed => sunbed._id.toString() === sunbedId);
    if (!sunbed) {
      return res.status(404).json({ message: 'Sunbed not found' });
    }

    const sunbedPrice = sunbed.price;
    res.json({ price: sunbedPrice });
  } catch (err) {
    console.error('Error getting sunbed price by ID:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = { createRestaurant, getRestaurants, updateRestaurant, deleteRestaurant, getSunbedById, addSunbed,updateSunbed, deleteSunbed, getSunbedsByDate, getSunbedsByRestaurantId, getSunbedTypeById, getSunbedPriceById,getRestaurantById };
