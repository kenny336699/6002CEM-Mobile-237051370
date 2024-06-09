import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import FastImage from 'react-native-fast-image';
import {WeatherCondition, WeatherEntry} from '../type/weather';
import {format} from 'date-fns';
type Props = {
  weather: WeatherEntry[];
};
const clear = require('../assets/images/weathers/clear.png');
const cloudy = require('../assets/images/weathers/cloudy.png');
const partCloudy = require('../assets/images/weathers/partCloudy.png');
const rain = require('../assets/images/weathers/rain.png');

const WeatherComponent = ({weather}: Props) => {
  const getWeatherImage = (condition: string) => {
    if (condition === WeatherCondition.Clear) {
      return clear;
    } else if (condition === WeatherCondition.Cloudy) {
      return cloudy;
    } else if (condition === WeatherCondition.PartlyCloudy) {
      return partCloudy;
    } else if (condition === WeatherCondition.Rain) {
      return rain;
    }
  };
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'd MMMM');
  };
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {weather?.map((entry, index) => (
          <View key={index} style={styles.weatherEntry}>
            <Text>{formatDate(entry.date)}</Text>
            <FastImage
              source={getWeatherImage(entry.condition)}
              style={styles.weatherImage}
              resizeMode={FastImage.resizeMode.contain}
            />
            <Text style={styles.condition}>{entry.condition}</Text>
            <Text style={styles.temperature}>{`${entry.temperature}°`}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
  },
  weatherEntry: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
    width: 120,
    margin: 8,
  },
  weatherImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    aspectRatio: 1,
  },
  condition: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  temperature: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ff4500',
  },
});

export default WeatherComponent;
