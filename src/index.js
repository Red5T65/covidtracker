import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

window.onload = function() {
    const appDiv = document.createElement('div');
    document.body.appendChild(appDiv);

    ReactDOM.render(<App />, appDiv);
};

