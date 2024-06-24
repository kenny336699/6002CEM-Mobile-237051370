import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/Home/HomeScreen';
import TripScreen from '../screens/Trip/TripScreen';
import TranslateScreen from '../screens/Translate/TranslateScreen';

import FastImage from 'react-native-fast-image';
import {Platform, StyleSheet} from 'react-native';

const Tab = createBottomTabNavigator();

function BottomTabNav() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarLabelStyle: {
          fontFamily: 'NunitoSans-Regular',
          ...Platform.select({
            android: {
              paddingBottom: 2,
            },
          }),
        },
        tabBarActiveTintColor: '#F36E21',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({focused}) => {
            const source = !focused
              ? require('../assets/images/bottomTabs/home1.png')
              : require('../assets/images/bottomTabs/home2.png');
            return <FastImage style={styles.tabIcon} source={source} />;
          },
        }}
      />
      <Tab.Screen
        name="Trip"
        component={TripScreen}
        options={{
          tabBarLabel: 'Trip',
          tabBarIcon: ({focused}) => {
            const source = !focused
              ? require('../assets/images/bottomTabs/plan1.png')
              : require('../assets/images/bottomTabs/plan2.png');
            return <FastImage style={styles.tabIcon} source={source} />;
          },
        }}
      />
      <Tab.Screen
        name="Translate"
        component={TranslateScreen}
        options={{
          tabBarLabel: 'Translate',
          tabBarIcon: ({focused}) => {
            const source = !focused
              ? require('../assets/images/bottomTabs/translate1.png')
              : require('../assets/images/bottomTabs/translate2.png');
            return <FastImage style={styles.tabIcon} source={source} />;
          },
        }}
      />
    </Tab.Navigator>
  );
}
export default BottomTabNav;
const styles = StyleSheet.create({
  tabIcon: {width: 24, height: 24},
});
