import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNav from './BottomTabNav';

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
      </Stack.Navigator>
    </>
  );
}
export default StackNav;
