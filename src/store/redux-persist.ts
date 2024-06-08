import {MMKVLoader} from 'react-native-mmkv-storage';
import {createTransform} from 'redux-persist';
import Flatted from 'flatted';
export const transformCircular = createTransform(
  (inboundState, key) => Flatted.stringify(inboundState),
  (outboundState, key) => Flatted.parse(outboundState),
);
const reduxStorage = new MMKVLoader()
  .withInstanceID('redux-persist')
  .withEncryption()
  .initialize();

const persistConfig = {
  key: 'root',
  storage: reduxStorage,
  whitelist: [],
};

export {persistConfig};
