import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import ItineraryScreen from '../screens/Itinerary/ItineraryScreen';
import TranslateScreen from '../screens/Translate/TranslateScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Itinerary" component={ItineraryScreen} />
      <Tab.Screen name="Translate" component={TranslateScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
export default BottomTabNav;
