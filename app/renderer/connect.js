import React from 'react';
import { render } from 'react-dom';

export const connectWindow = (component) => (
    render(component, document.getElementById('root'))
);
