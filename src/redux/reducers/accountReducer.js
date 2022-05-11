// action - state management
import { io } from 'socket.io-client';
import config from '../../config';
import { ACCOUNT_INITIALIZE, LOGIN, LOGOUT, ACCOUNT_UPDATED } from '../actions';

export const initialState = {
    token: '',
    isLoggedIn: false,
    isInitialized: false,
    user: null,
};
//-----------------------|| ACCOUNT REDUCER ||-----------------------//
const socket = io.connect(config.SOCKET_SERVER)
const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case ACCOUNT_INITIALIZE: {
            const { isLoggedIn, user, token } = action.payload;
            return {
                ...state,
                isLoggedIn,
                isInitialized: true,
                token,
                user
            };
        }
        case LOGIN: {
            const { user } = action.payload;
            return {
                ...state,
                isLoggedIn: true,
                user
            };
        }
        case LOGOUT: {
            const userId = action.payload;
            socket.emit("logout", userId)
            return {
                ...state,
                isLoggedIn: false,
                token: '',
                user: null,
            };
        }
        case ACCOUNT_UPDATED: {
            const user = action.payload;
            return {
                ...state,
                user
            }
        }
        default: {
            return { ...state };
        }
    }
};

export default accountReducer;
