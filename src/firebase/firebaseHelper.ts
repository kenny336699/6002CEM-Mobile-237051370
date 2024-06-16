import firestore, {
  FirebaseFirestoreTypes,
  firebase,
} from '@react-native-firebase/firestore';
import {Attraction, City} from '../type/city';
import auth from '@react-native-firebase/auth';
import {format} from 'date-fns';
import {Trip} from '../type/trip';

const fetchCities = async (): Promise<City[]> => {
  try {
    const citiesCollection = await firestore().collection('cities').get();
    const citiesData = citiesCollection.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

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
const landmarks = [
  {
    documentId: 1,
    city_id: '/cities/tokyo',
    description:
      'Tokyo Tower is a communications and observation tower in the Shiba-koen district of Minato, Tokyo, Japan. At 332.9 meters, it is the second-tallest structure in Japan.',
    image_url: 'https://www.japan-guide.com/g18/3009_01.jpg',
    name: 'Tokyo Tower',
    coordinates: {latitude: 35.6585805, longitude: 139.7454329},
  },
  {
    documentId: 2,
    city_id: '/cities/tokyo',
    description:
      'Shibuya Crossing is a popular scramble crossing in Tokyo, Japan. It is located in front of the Shibuya Station Hachikō exit and stops vehicles in all directions to allow pedestrians to inundate the entire intersection.',
    image_url: 'https://www.japan-guide.com/g18/3007_01.jpg',
    name: 'Shibuya Crossing',
    coordinates: {latitude: 35.6595, longitude: 139.7004},
  },
  {
    documentId: 3,
    city_id: '/cities/tokyo',
    description:
      "Senso-ji is an ancient Buddhist temple located in Asakusa, Tokyo, Japan. It is Tokyo's oldest temple, and one of its most significant.",
    image_url: 'https://www.japan-guide.com/g18/3001_01.jpg',
    name: 'Senso-ji Temple',
    coordinates: {latitude: 35.7148, longitude: 139.7967},
  },
  {
    documentId: 10,
    city_id: '/cities/nagoya',
    description:
      'Nagoya Castle is a Japanese castle located in Nagoya, central Japan. During the Edo period, Nagoya Castle was the center of one of the most important castle towns in Japan.',
    image_url: 'https://www.japan-guide.com/g18/3300_11.jpg',
    name: 'Nagoya Castle',
    coordinates: {latitude: 35.185, longitude: 136.899},
  },
  {
    documentId: 11,
    city_id: '/cities/nagoya',
    description:
      'Atsuta Shrine is a Shinto shrine traditionally believed to have been established during the reign of Emperor Keikō, located in Atsuta-ku, Nagoya, Aichi Prefecture in Japan.',
    image_url: 'https://www.japan-guide.com/g21/3301_01.jpg',
    name: 'Atsuta Shrine',
    coordinates: {latitude: 35.1264, longitude: 136.9084},
  },
  {
    documentId: 12,
    city_id: '/cities/nagoya',
    description:
      'The Toyota Commemorative Museum of Industry and Technology is a museum that showcases the history of the Toyota Group, highlighting its technological innovations in the fields of textiles and automobiles.',
    image_url:
      'https://lh3.googleusercontent.com/p/AF1QipODtGCjFl5u1Bn_YOrcPI6jG-Dp7trEJKlSuN86=s1360-w1360-h1020',
    name: 'Toyota Commemorative Museum',
    coordinates: {latitude: 35.1808, longitude: 136.8825},
  },
  {
    documentId: 4,
    city_id: '/cities/kyoto',
    description:
      'Fushimi Inari Taisha is the head shrine of the kami Inari, located in Fushimi-ku, Kyoto, Kyoto Prefecture, Japan. The shrine sits at the base of a mountain also named Inari which is 233 metres above sea level, and includes trails up the mountain to many smaller shrines which span 4 kilometres.',
    image_url: 'https://www.japan-guide.com/g18/3915_top.jpg',
    name: 'Fushimi Inari-taisha',
    coordinates: {latitude: 34.9671, longitude: 135.7727},
  },
  {
    documentId: 5,
    city_id: '/cities/kyoto',
    description:
      "Kinkakuji (金閣寺, Golden Pavilion) is a Zen temple in northern Kyoto whose top two floors are completely covered in gold leaf. Formally known as Rokuonji, the temple was the retirement villa of the shogun Ashikaga Yoshimitsu, and according to his will it became a Zen temple of the Rinzai sect after his death in 1408. Kinkakuji was the inspiration for the similarly named Ginkakuji (Silver Pavilion), built by Yoshimitsu's grandson, Ashikaga Yoshimasa, on the other side of the city a few decades later.",
    image_url: 'https://www.japan-guide.com/g18/3908_top.jpg',
    name: 'Kinkaku-ji',
    coordinates: {latitude: 35.0394, longitude: 135.7292},
  },
  {
    documentId: 6,
    city_id: '/cities/kyoto',
    description:
      'Arashiyama (嵐山) is a pleasant, touristy district in the western outskirts of Kyoto. The area has been a popular destination since the Heian Period (794-1185), when nobles would enjoy its natural setting. Arashiyama is particularly popular during the cherry blossom and fall color seasons.',
    image_url: 'https://www.japan-guide.com/g18/3912_top.jpg',
    name: 'Arashiyama Bamboo Grove',
    coordinates: {latitude: 35.0094, longitude: 135.6672},
  },
  {
    documentId: 7,
    city_id: '/cities/osaka',
    description:
      "Osaka Castle is a Japanese castle in Chūō-ku, Osaka, Japan. The castle is one of Japan's most famous landmarks and it played a major role in the unification of Japan during the sixteenth century of the Azuchi-Momoyama period.",
    image_url: 'https://www.japan-guide.com/g18/4000_top.jpg',
    name: 'Osaka Castle',
    coordinates: {latitude: 34.6873, longitude: 135.5262},
  },
  {
    documentId: 8,
    city_id: '/cities/osaka',
    description:
      "Dotonbori is one of the principal tourist destinations in Osaka, Japan, running along the Dotonbori canal from Dotonboribashi Bridge to Nipponbashi Bridge in the Namba district of the city's Chuo ward.",
    image_url: 'https://www.japan-guide.com/g21/4001_01.jpg',
    name: 'Dotonbori',
    coordinates: {latitude: 34.6687, longitude: 135.5013},
  },
  {
    documentId: 9,
    city_id: '/cities/osaka',
    description:
      'Universal Studios Japan, located in Osaka, is one of six Universal Studios theme parks, owned and operated by USJ LLC, which is majority owned by NBCUniversal.',
    image_url: 'https://www.japan-guide.com/g18/4021_top.jpg',
    name: 'Universal Studios Japan',
    coordinates: {latitude: 34.6654, longitude: 135.4323},
  },
];

const addLandmarks = async () => {
  const landmarksCollection = firestore().collection('attractions');

  for (const landmark of landmarks) {
    try {
      await landmarksCollection
        .doc(landmark.documentId.toString())
        .set(landmark);
      console.log(`Document ${landmark.documentId} added successfully`);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }
};

const firebaseLogin = async (email: string, password: string) => {
  try {
    const data = await auth().signInWithEmailAndPassword(email, password);
    console.log('User signed in!', data);
    return {success: true};
  } catch (error) {
    let errorMessage = 'An error occurred during login.';

    switch (error.code) {
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password.';
        break;
      case 'auth/invalid-email':
        errorMessage = 'Invalid email address.';
        break;
      default:
        errorMessage = error.message;
        break;
    }

    return {success: false, errorMessage};
  }
};
const firebaseRegister = async (
  email: string,
  password: string,
  displayName: string,
) => {
  try {
    // Create user with email and password
    const userCredential = await auth().createUserWithEmailAndPassword(
      email,
      password,
    );
    const user = userCredential.user;

    // Update the user's profile with the display name
    await user.updateProfile({
      displayName: displayName,
    });
    const resut = await auth().signOut();
    return resut;
  } catch (error) {
    // Handle different error cases
    switch (error.code) {
      case 'auth/email-already-in-use':
        console.log('That email address is already in use!');
        break;
      case 'auth/invalid-email':
        console.log('That email address is invalid!');
        break;
      case 'auth/weak-password':
        console.log('The password is too weak.');
        break;
      default:
        console.error('Error creating user:');
        break;
    }
  }
};
const fetchAttractionDetails = async (days: Trip['days']) => {
  try {
    const attractionRefs = [
      ...days.map(day => day.morning),
      ...days.map(day => day.afternoon),
    ].filter(
      (ref): ref is FirebaseFirestoreTypes.DocumentReference => ref !== null,
    );

    const attractionSnapshots = await Promise.all(
      attractionRefs.map(ref => ref.get()),
    );

    const attractionsMap = new Map<string, Attraction>();
    attractionSnapshots.forEach(doc => {
      const data = doc.data();
      if (data) {
        attractionsMap.set(doc.id, {
          id: doc.id,
          name: data.name,
          description: data.description,
          cityId: data.cityId,
          image_url: data.image_url,
          coordinates: data.coordinates,
        });
      }
    });
    return attractionsMap;
  } catch (error) {}
};
const firebaseLogout = () => {
  auth()
    .signOut()
    .then(() => console.log('User signed out!'));
};
const formatDate = (date: FirebaseFirestoreTypes.Timestamp | null): string => {
  if (!date) return 'Invalid Date';

  try {
    return format(date.toDate(), 'dd MMMM yyyy');
  } catch (error) {
    console.error('Error formatting date: ', error);
    return 'Invalid Date';
  }
};

const fetchTrips = async (email: string) => {
  try {
    const tripsRef = firestore().collection('trips');
    const querySnapshot = await tripsRef.where('user_id', '==', email).get();

    const tripsData: Trip[] = querySnapshot.docs.map(doc => {
      const data = doc.data() as Trip;
      const startDate =
        data.start_date instanceof firebase.firestore.Timestamp
          ? data.start_date
          : null;
      const endDate =
        data.end_date instanceof firebase.firestore.Timestamp
          ? data.end_date
          : null;

      return {
        id: doc.id,
        user_id: data.user_id,
        trip_name: data.trip_name,
        start_date: startDate,
        end_date: endDate,
        days: data.days || [],
      };
    });
    return tripsData;
  } catch (error) {
    console.error('Error fetching trips: ', error);
    throw error;
  }
};

export default {
  fetchCityWithAttractions,
  fetchCities,
  firebaseLogin,
  firebaseRegister,
  firebaseLogout,
  formatDate,
  fetchAttractionDetails,
  fetchTrips,
};
