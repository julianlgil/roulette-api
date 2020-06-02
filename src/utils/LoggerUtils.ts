import {createLogger, format, transports} from 'winston';
import log4js from 'log4js';
import config from "../config";


const LOGGER_LEVEL = config.loggerLevel;
export default class LoggerUtils {

    public static createLogger(nameSpace: string) {
        const logger = log4js.getLogger(nameSpace);
        logger.level = LOGGER_LEVEL;
        return logger;
        // return createLogger({
        //     format: format.combine(
        //         format.simple(),
        //         format.timestamp(),
        //         format.printf(info => `[${info.timestamp}] [${info.level.toUpperCase()}] ${nameSpace}: ${info.message}`)
        //     ),
        //     transports: [
        //         new transports.Console({
        //             level: LOGGER_LEVEL,
        //         }),
        //         new transports.File({
        //             level: LOGGER_LEVEL,
        //             maxsize: 5120000,
        //             maxFiles: 5,
        //             filename: `${__dirname}/../logs/log-roulette-api.log`
        //         })
        //     ]
        // });
    };
}
