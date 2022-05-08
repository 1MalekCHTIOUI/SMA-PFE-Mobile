import { createStore } from 'redux';
import { persistStore } from 'redux-persist';
import reducer from './reducers';

//-----------------------|| REDUX - MAIN STORE ||-----------------------//

const store = createStore(reducer);
const persister = persistStore(store);

export { store, persister };
