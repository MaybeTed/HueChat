import { combineReducers } from 'redux';
import authReducer from './auth_reducer';

const reducer = combineReducers({
	auth: authReducer,
});

export default reducer;
