export interface City {
  id: number;
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
export type Attraction = {
  id: string;
  cityId: any; // You can replace 'any' with the appropriate Firestore reference type if available
  name: string;
  imageUrl: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
