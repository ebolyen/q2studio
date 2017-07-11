import { app, BrowserWindow } from 'electron';

import getRoute from 'q2studio-main/routing';



let mainWindow = null;

const createWindow = () => {

    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.toggleDevTools();

    let mainPage;

    mainWindow.loadURL(getRoute('window/main.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

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
