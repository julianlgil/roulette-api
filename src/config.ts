export default {
    apiPath: '',
    loggerLevel: process.env.LOGGER_LEVEL || 'debug',
    port: process.env.PORT || '8110',
    redisConnections: process.env.REDIS_CONECTION || '{ \"port\": 6379, \"host\": \"localhost"}',
};
