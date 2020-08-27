import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import classes from './index.less';

window.onload = function() {
    const appDiv = document.createElement('div');
    appDiv.classList.add(classes.app);
    document.body.appendChild(appDiv);

    ReactDOM.render(<App />, appDiv);
};

