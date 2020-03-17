import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/App.css';
import { Provider } from './Context';

ReactDOM.render(
    <Provider>
        <App />
    </Provider>, 
    document.getElementById('root'));