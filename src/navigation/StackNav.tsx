import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabNav';
import AttractionsScreen from '../screens/City/AttractionsScreen';

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
        <Stack.Screen name="Attractions" component={AttractionsScreen} />
      </Stack.Navigator>
    </>
  );
}
export default StackNav;
