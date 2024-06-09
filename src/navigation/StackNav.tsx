import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabNav';

import CityScreen from '../screens/City/CityScreen';
import AttractionScreen from '../screens/City/AttractionScreen';

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
      </Stack.Navigator>
    </>
  );
}
export default StackNav;
