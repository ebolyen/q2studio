import { app, BrowserWindow } from 'electron';

import getRoute from 'q2studio-main/routing';


let mainWindow = null;

const onReady = () => {
    createWindow();
    if (process.env.NODE_ENV === 'development') {
        // TODO: can this be statically elided?
        mainWindow.toggleDevTools();

        const { 
            default: installExtension, 
            REDUX_DEVTOOLS, 
            REACT_DEVELOPER_TOOLS 
        } = require('electron-devtools-installer');
        installExtension(REACT_DEVELOPER_TOOLS);
        installExtension(REDUX_DEVTOOLS);
    }

}

const createWindow = () => {
    mainWindow = new BrowserWindow({ width: 800, height: 600 });

    mainWindow.loadURL(getRoute('window/main.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', onReady);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
