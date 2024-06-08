export interface City {
  id: string;
  name: string;
  description: string;
  image_url: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  attractions: number[];
}

export interface CitiesState {
  locations: City[];
}
