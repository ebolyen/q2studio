import path from 'path';
import url from 'url';
import { app, BrowserWindow } from 'electron';



let mainWindow = null;

const createWindow = () => {

    mainWindow = new BrowserWindow({ width: 800, height: 600 });
    mainWindow.toggleDevTools();

    let mainPage;

    if (process.env.NODE_ENV === 'development') {
        mainPage = `${HMR_ORIGIN}/window/main.html`;
    } else {
        mainPage = url.format({
            pathname: path.resolve(__dirname, './window/main.html'),
            protocol: 'file:',
            slashes: true
        });
    }

    mainWindow.loadURL(mainPage);

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
