import React, {useEffect, useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import FastTranslator from 'fast-mlkit-translate-text';

const TranslateScreen: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [identifiedLanguage, setIdentifiedLanguage] = useState<string>('');
  const [translatedText, setTranslatedText] = useState<string>('');

  const handleTranslation = async () => {
    try {
      // Identify the language
      const language = await FastTranslator.identify(inputText);
      setIdentifiedLanguage(language);

      // Translate the text
      const translated = await FastTranslator.translate(inputText);
      setTranslatedText(translated);
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fast Translator</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter text to translate"
        value={inputText}
        onChangeText={setInputText}
      />
      <Button title="Translate" onPress={handleTranslation} />
      <View style={styles.resultContainer}>
        {identifiedLanguage ? (
          <Text style={styles.result}>
            Identified Language: {identifiedLanguage}
          </Text>
        ) : null}
        {translatedText ? (
          <Text style={styles.result}>Translated Text: {translatedText}</Text>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  resultContainer: {
    marginTop: 16,
  },
  result: {
    fontSize: 18,
    marginVertical: 4,
  },
});

export default TranslateScreen;
