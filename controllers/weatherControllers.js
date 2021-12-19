import axios from 'axios';
import asyncHandler from 'express-async-handler';
import weatherModel from '../models/weatherModel.js';


// @desc   Fetch current weather of HK from API. If api down search db and return latest entry, if DB empty then error. 
// @route  /weather
// @access public
const getWeather = asyncHandler (async (req, res) => {
  const apiKey = process.env.WEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=Hong%20Kong&appid=${apiKey}`;
  const response = await axios.get(url);

  if (response.status == 200){    
    try {
      const weather = await weatherModel.create(
        {
          ...response.data,
          user: req.user._id
        });
      if (weather)
      {
        res.status(200);
        res.json(response.data);
      } else {
        res.status(400)
        throw new Error('Invalid weather Data');
      }
    } catch (error){
      res.status(400);
      console.log(`Error: ${error.message}`);
      process.exit(1);
    }
  } else {
      try{
        const weather = await weatherModel.findOne({user: req.user._id},{}, { sort: { 'created_at' : -1 }});
        console.log(weather);
        if(weather){
          res.status(200);
          res.json(weather);
        } else{
          res.status(404);
          throw new Error("No weather data found");
        }
      } catch (error){
        res.status(404);
        throw new Error("No weather data found");
      }
    }
})

export default getWeather;