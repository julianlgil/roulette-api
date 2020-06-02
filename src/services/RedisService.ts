import config from "../config";
import Redis from 'ioredis';
import {stringNullable} from "../utils/Types";

const redisConnnection = JSON.parse(config.redisConnections);

export class RedisService {

    public static async saveAndExpire(key: string, data: string, timeInSeconds: number): Promise<void> {
            const redis = this.createClient();
            await redis.set(key, data, 'ex', timeInSeconds);
            redis.quit();
    }

    public static async saveHash(hash: string, key: string, value: string): Promise<void> {
        const redis = this.createClient();
        await redis.hset(hash, key, value);
        redis.quit();
    }

    public static async getAllHash(hash: string): Promise<Record<string, string>> {
        const redis = this.createClient();
        const data = await redis.hgetall(hash);
        redis.quit();
        return data;
    }

    public static async getHashKey(hash: string, key: string): Promise<stringNullable> {
        const redis = this.createClient();
        const data = await redis.hget(hash, key);
        redis.quit();
        return data;
    }

    public static async verifyIfExist(key: string): Promise<boolean> {
        const redis = this.createClient();
        const keys = await redis.keys(key);
        redis.quit();
        return keys.length >= 1;
    }

    public static async find(key: string): Promise<stringNullable> {
        const redis = this.createClient();
        const data = await redis.get(key);
        redis.quit();
        return data;
    }

    public static async watch(key: string): Promise<void> {
        const redis = this.createClient();
        await redis.watch(key);
    }

    public static async exec(): Promise<void> {
        const redis = this.createClient();
        await redis.exec();
        redis.quit();
    }

    public static async multi(): Promise<void> {
        const redis = this.createClient();
        await redis.multi();
    }

    private static createClient() {
        return new Redis(redisConnnection);
    }

}
