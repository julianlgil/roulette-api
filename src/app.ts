import cookieParser from 'cookie-parser';
import express from 'express';
import log4js from 'log4js';
import path from 'path';
import config from './config';
import rouletteController from './controllers/RouletteController';
import LoggerUtils from "./utils/LoggerUtils";

const app = express();
const apiPath = config.apiPath;
const LOGGER = LoggerUtils.createLogger('app');

app.use(log4js.connectLogger(LoggerUtils.createLogger('http'), { level: 'auto' }));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../static')));

// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Authorization, Origin, Content-Type, Accept, Access-Control-Allow-Request-Method'
    );
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// add the controllers you need here
app.use(apiPath, rouletteController);

export default app;
