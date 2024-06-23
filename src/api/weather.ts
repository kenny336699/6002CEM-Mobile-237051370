// api/weather.js

import axios from 'axios';
import {
  WeatherCondition,
  WeatherData,
  WeatherEntry,
  weather,
} from '../type/weather';

//const API_KEY = 'zSdzq4jpHSNkHYDL7IGOcSjTTPLL7ySB';
const API_KEY = '9iiMF8Qhnic8yVcZ3w8dgc9YJSV3f0NH';
const BASE_URL = 'https://api.tomorrow.io/v4/weather/forecast';

const getWeatherForecast = async (
  latitude: number,
  longitude: number,
): Promise<WeatherEntry[]> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        location: `${latitude},${longitude}`,
        fields: 'temperature',
        timesteps: '1d',
        apikey: API_KEY,
      },
    });
    const usefulData: WeatherData[] = response.data.timelines.daily;
    // const usefulData: WeatherData[] = [
    //   {
    //     time: '2024-06-07T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 40.75,
    //       cloudCoverMax: 93,
    //       precipitationProbabilityAvg: 0,
    //       precipitationProbabilityMax: 0,
    //       rainAccumulationSum: 0,
    //       weatherCodeMax: 1000,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 22.51,
    //     },
    //   },
    //   {
    //     time: '2024-06-08T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 30,
    //       cloudCoverMax: 50,
    //       precipitationProbabilityAvg: 10,
    //       precipitationProbabilityMax: 20,
    //       rainAccumulationSum: 5,
    //       weatherCodeMax: 1100,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 20.42,
    //     },
    //   },
    //   {
    //     time: '2024-06-09T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 80,
    //       cloudCoverMax: 90,
    //       precipitationProbabilityAvg: 30,
    //       precipitationProbabilityMax: 40,
    //       rainAccumulationSum: 10,
    //       weatherCodeMax: 1100,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 23.17,
    //     },
    //   },
    //   {
    //     time: '2024-06-10T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 90,
    //       cloudCoverMax: 100,
    //       precipitationProbabilityAvg: 0,
    //       precipitationProbabilityMax: 0,
    //       rainAccumulationSum: 0,
    //       weatherCodeMax: 1000,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 23.37,
    //     },
    //   },
    //   {
    //     time: '2024-06-11T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 40,
    //       cloudCoverMax: 60,
    //       precipitationProbabilityAvg: 10,
    //       precipitationProbabilityMax: 20,
    //       rainAccumulationSum: 5,
    //       weatherCodeMax: 1000,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 23.3,
    //     },
    //   },
    //   {
    //     time: '2024-06-12T21:00:00Z',
    //     values: {
    //       cloudCoverAvg: 10,
    //       cloudCoverMax: 20,
    //       precipitationProbabilityAvg: 0,
    //       precipitationProbabilityMax: 0,
    //       rainAccumulationSum: 0,
    //       weatherCodeMax: 1000,
    //       weatherCodeMin: 1000,
    //       temperatureAvg: 26.54,
    //     },
    //   },
    // ];
    const dailyWeather: WeatherEntry[] = [];
    usefulData.map(data => {
      const item = {
        condition: determineWeather(data.values),
        date: data.time,
        temperature: data.values.temperatureAvg,
      };
      return dailyWeather.push(item);
    });

    return dailyWeather;
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};

function determineWeather(data: weather): string {
  const {
    cloudCoverAvg,
    cloudCoverMax,
    precipitationProbabilityAvg,
    precipitationProbabilityMax,
    rainAccumulationSum,
    weatherCodeMax,
    weatherCodeMin,
  } = data;

  // Check for rain
  if (
    precipitationProbabilityAvg > 0 ||
    precipitationProbabilityMax > 0 ||
    rainAccumulationSum > 0
  ) {
    return WeatherCondition.Rain;
  }

  // Check for clear weather based on weather codes
  if (weatherCodeMax === 1000 && weatherCodeMin === 1000) {
    // Further check cloud cover for a more accurate sunny/cloudy determination
    if (cloudCoverAvg < 20 && cloudCoverMax < 20) {
      return WeatherCondition.Clear;
    } else if (cloudCoverAvg >= 20 && cloudCoverAvg < 80) {
      return WeatherCondition.PartlyCloudy;
    } else {
      return WeatherCondition.Cloudy;
    }
  }

  // Default to cloudy if cloud cover is high
  if (cloudCoverAvg >= 80 || cloudCoverMax >= 80) {
    return WeatherCondition.Cloudy;
  }

  // Otherwise, it's partly cloudy
  return WeatherCondition.PartlyCloudy;
}

export default getWeatherForecast;
