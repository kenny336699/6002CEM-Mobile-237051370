import firestore from '@react-native-firebase/firestore';
import {Attraction, City} from '../type/city';
import FastTranslator from 'fast-mlkit-translate-text';

const fetchCities = async (): Promise<City[]> => {
  try {
    const citiesCollection = await firestore().collection('cities').get();
    const citiesData = citiesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));
    console.log('c', citiesData);
    return citiesData as City[];
  } catch (error) {
    console.error('Error fetching cities: ', error);
    return []; // Ensure an array is returned in case of error
  }
};

const fetchCityWithAttractions = async (cityId: string) => {
  try {
    const cityDoc = await firestore().collection('cities').doc(cityId).get();
    if (!cityDoc.exists) {
      throw new Error('City not found');
    }
    const cityData = cityDoc.data();
    const attractionRefs = cityData.attractions;

    attractionRefs.forEach(attractionRef => {
      attractionRef
        .get()
        .then(attractionDoc => {
          console.log('Attraction doc:', attractionDoc);
          if (attractionDoc.exists) {
            const attractionData = attractionDoc.data();
            console.log('Attraction:', attractionData);
          } else {
            console.log('Attraction document does not exist');
          }
        })
        .catch(error => {
          console.error('Error getting attraction document:', error);
        });
    });
  } catch (error) {
    console.error('Error fetching city with attractions: ', error);
    throw error;
  }
};

export default {fetchCityWithAttractions, fetchCities};
