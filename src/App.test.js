import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import store from "./store.js";



it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(
	<Router>
		<Provider store={store}>
			<App />
		</Provider>
	</Router>, div);
  ReactDOM.unmountComponentAtNode(div);
});
