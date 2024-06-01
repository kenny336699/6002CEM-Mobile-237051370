import {View, FlatList, Text, Image, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import FastTranslator from 'fast-mlkit-translate-text';
const Login = () => {
  const [cities, setCities] = useState([]);
  const [text, setText] = useState('21321312');
  useEffect(() => {
    const fetchCities = async () => {
      await FastTranslator.prepare({
        source: 'Japanese',
        target: 'English',
        downloadIfNeeded: true, // set to false if you want to download mannually
      });
      const text = '大阪';

      FastTranslator.identify(text)
        .then((result: string) => {
          //output: 'en'
          console.log(result);
          setText(result);
        })
        .catch((err: Error) => {
          //handle error
          console.log(err);
        });
      const rs = await FastTranslator.translate(text);
      console.log(rs);
      setText(rs);
    };

    fetchCities();
  }, []);
  return (
    <View style={styles.container}>
      <Text>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cityImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 8,
  },
  cityDescription: {
    fontSize: 14,
    color: '#555',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
});
export default Login;
