import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import Main from 'q2studio/main';

ReactDOM.render(
    <AppContainer><Main /></AppContainer>, 
    document.getElementById('root'));

if (module.hot) {
    module.hot.accept(
        'q2studio/main', 
        () => ReactDOM.render(
            <Main />, 
            document.getElementById('root')));
}
