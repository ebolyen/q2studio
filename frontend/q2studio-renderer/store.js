import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

export const connectWindow = (dependency, component) => {
    render(<AppContainer>{ component }</AppContainer>, document.getElementById('root'));

    if (module.hot) {
        module.hot.accept(dependency, () => render(<component />, document.getElementById('root')));
    }
};
