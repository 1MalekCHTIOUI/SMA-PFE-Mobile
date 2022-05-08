import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
// import storage from 'redux-persist/lib/storage';
import {AsyncStorage} from 'react-native';
// reducer import
// import customizationReducer from './customizationReducer';
import accountReducer from './accountReducer';
// import socketReducer from './socketReducer';

//-----------------------|| COMBINE REDUCER ||-----------------------//

const reducer = combineReducers({
    account: persistReducer(
        {
            key: 'account',
            storage: AsyncStorage,
        },
        accountReducer
    ),
});

export default reducer;
