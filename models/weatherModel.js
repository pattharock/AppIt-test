import mongoose from 'mongoose';

const weatherSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    coord: {
      lon: Number,
      lat: Number,
    },
    weather: [
      {
        id: Number,
        main: String,
        description: String,
        icon: String,
      }
    ],
    base: String,
    main: {
      temp: Number,
      feels_like: Number,
      temp_min: Number,
      temp_max: Number,
      pressure: Number,
      humidity: Number,
    },
    visibility: Number,
    wind: {
      speed: Number,
      deg: Number,
    },
    clouds: {
      all: Number,
    },
    dt: Number,
    sys: Object,
    id: Number,
    name: String,
    cod: Number,
  },{
    timestamps: true
  }
);

const weatherModel = mongoose.model('weather', weatherSchema);

export default weatherModel;