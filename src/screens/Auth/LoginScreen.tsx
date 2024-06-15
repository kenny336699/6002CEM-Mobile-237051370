import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import firebaseHelper from '../../firebase/firebaseHelper';
const leftArrow = require('../../assets/images/icon/Arrow_alt_left_alt.png');

const LoginScreen = () => {
  const [email, setEmail] = useState('t12321@yop.com');
  const [password, setPassword] = useState('123456');
  const [displayName, setDisplayName] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isRegister, setIsRegister] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    let errors = [];
    if (isRegister && !displayName) {
      errors.push('Display Name cannot be empty.');
    }
    if (!email) {
      errors.push('Email cannot be empty.');
    }
    if (!password) {
      errors.push('Password cannot be empty.');
    }
    return errors.length ? errors.join(' ') : null;
  };

  const handleLogin = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      await firebaseHelper.firebaseLogin(email, password);
      setErrorMessage(null);
      navigation.goBack(); // Navigate back on successful login
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handleRegister = async () => {
    const error = validateInputs();
    if (error) {
      setErrorMessage(error);
      return;
    }

    try {
      await firebaseHelper.firebaseRegister(email, password, displayName);
      setErrorMessage(null);
      navigation.goBack(); // Navigate back on successful registration
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const toggleMode = () => {
    setIsRegister(!isRegister);
    setErrorMessage(null);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <FastImage source={leftArrow} style={styles.backImage} />
      </TouchableOpacity>
      <FastImage
        source={require('../../assets/images/icon/appIcon.png')}
        style={styles.image}
      />
      {isRegister && (
        <>
          <Text style={styles.label}>Display Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Display Name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
          />
        </>
      )}
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />
      {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
      <TouchableOpacity
        style={styles.button}
        onPress={isRegister ? handleRegister : handleLogin}>
        <Text style={styles.buttonText}>
          {isRegister ? 'Register' : 'Login'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleMode}>
        <Text style={styles.toggleButtonText}>
          {isRegister
            ? 'Already have an account? Login'
            : "Don't have an account? Register"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8e1e4',
    padding: 16,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  backButtonText: {
    color: '#000',
    fontSize: 18,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  label: {
    alignSelf: 'flex-start',
    marginLeft: 20,
    fontSize: 16,
    color: '#333',
  },
  input: {
    height: 40,
    width: '90%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  button: {
    width: '90%',
    height: 40,
    backgroundColor: '#e57373',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  backImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  toggleButton: {
    marginTop: 20,
  },
  toggleButtonText: {
    color: '#e57373',
    fontSize: 14,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default LoginScreen;
