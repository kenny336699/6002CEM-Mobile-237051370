import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabNav';

import CityScreen from '../screens/City/CityScreen';
import AttractionScreen from '../screens/City/AttractionScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import TripDetailScreen from '../screens/Trip/TripDetailScreen';
import CitiesScreen from '../screens/City/CitiesScreen';
import AddTripScreen from '../screens/Trip/AddTripScreen';

const Stack = createNativeStackNavigator();

function StackNav() {
  return (
    <>
      <Stack.Navigator screenOptions={() => ({})}>
        <Stack.Screen
          name="BottomTabNav"
          component={BottomTabNav}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="City"
          component={CityScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Attraction"
          component={AttractionScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="TripDetail"
          component={TripDetailScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Cities"
          component={CitiesScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="CreateTrip"
          component={AddTripScreen}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </>
  );
}
export default StackNav;
