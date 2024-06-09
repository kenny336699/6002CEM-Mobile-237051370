export interface WeatherData {
  time: string;
  values: weather;
}
export type weather = {
  cloudCoverAvg: number;
  cloudCoverMax: number;
  precipitationProbabilityAvg: number;
  precipitationProbabilityMax: number;
  rainAccumulationSum: number;
  weatherCodeMax: number;
  weatherCodeMin: number;
  temperatureAvg: number;
};
export enum WeatherCondition {
  Clear = 'Clear',
  PartlyCloudy = 'Partly Cloudy',
  Cloudy = 'Cloudy',
  Rain = 'Rain',
}

// Define the WeatherEntry interface
export interface WeatherEntry {
  condition: string;
  date: string;
  temperature: number;
}
