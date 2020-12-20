import React from 'react';
import ReactDOM from 'react-dom';
import Routers from './Routers';
import reportWebVitals from './reportWebVitals';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import allReducers from './utils/reducers';
import './styles/index.scss';
import 'bootstrap/dist/css/bootstrap.min.css';

const store = createStore(allReducers);

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<Routers />
		</Provider>
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
