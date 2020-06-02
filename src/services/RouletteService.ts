import { v4 as uuidv4 } from 'uuid';
import {RedisService} from "./RedisService";
import LoggerUtils from "../utils/LoggerUtils";
import {IBetRequest} from "../models/IBetRequest";
import {IBet} from "../models/IBet";
import {stringNullable} from "../utils/Types";
import {IBetData} from "../models/IBetData";

const LOGGER = LoggerUtils.createLogger('RouletteService');

export default class RouletteService {
    public static async createRoulette(): Promise<string> {
        try {
            const uuid = uuidv4();
            const rouletteKey = `roulette:${uuid}`;
            const timestamp = new Date().toISOString();
            await RedisService.saveHash(rouletteKey, 'timestamp', timestamp);
            await RedisService.saveHash(rouletteKey, 'status', 'closed');
            LOGGER.info('Roulette created with id: %s', uuid);
            return uuid;
        } catch (e) {
            LOGGER.error('Roulette was not create. Cause: %s', e);
            throw new Error('Roulette was not created');
        }
    }

    public static async getRouletteList(): Promise<string> {
        try {
            const uuid = uuidv4();
            const rouletteKey = `roulette:${uuid}`;
            const timestamp = new Date().toISOString();
            await RedisService.saveHash(rouletteKey, 'timestamp', timestamp);
            await RedisService.saveHash(rouletteKey, 'status', 'closed');
            LOGGER.info('Roulette created with id: %s', uuid);
            return uuid;
        } catch (e) {
            LOGGER.error('Roulette was not create. Cause: %s', e);
            throw new Error('Roulette was not created');
        }
    }

    public static async openRoulette( rouletteId: string) {
        const rouletteKey = `roulette:${rouletteId}`;
        const rouletteStatus = await RedisService.getHashKey(rouletteKey, 'status');
        if (rouletteStatus === 'closed') {
            RedisService.saveHash(rouletteKey, 'status', 'open');
        } else {
            throw new Error('This roulette is currently open');
        }
    }

    public static async setBet(betRequest: IBetRequest): Promise<string> {
        const rouletteId = betRequest.rouletteId;
        const rouletteBetsKey = `bets:${rouletteId}`;
        const betUuid = uuidv4();
        const bet = {
            amount: betRequest.amount,
            color: betRequest.color,
            number: betRequest.number,
            userId: betRequest.userId
        } as IBet;
        if (bet.color && bet.number) {
            throw new Error('Bet denied. Cause: Bet cannot have number and color, specify one only')
        }
        const rouletteKey = `roulette:${rouletteId}`;
        const rouletteStatus = await RedisService.getHashKey(rouletteKey, 'status');
        if (rouletteStatus === 'closed') {
            throw new Error('Bet denied. Cause: Bet is closed');
        }
        LOGGER.info('Bet to save: %j', bet);
        try {
            await RedisService.saveHash(rouletteBetsKey, betUuid, JSON.stringify(bet));
            LOGGER.info('Bet created with id: %s', betUuid);
            return betUuid;
        } catch (error) {
            LOGGER.error('Roulette was not create. Cause: %s', error);
            throw new Error('Bet was not created');
        }
    }

    public static async closeRoulette(rouletteId: string) {
        const rouletteKey = `roulette:${rouletteId}`;
        //RedisService.saveHash(rouletteKey, 'status', 'closed');
        const rouletteBetsKey = `bets:${rouletteId}`;
        const betsFromRedis = await RedisService.getAllHash(rouletteBetsKey);
        try {
            const betsRouletteList = this.mapBetsFromRedis(betsFromRedis);
            LOGGER.info('Bets list to roulette with id: %s, is: %o', rouletteId, betsRouletteList);
            return betsRouletteList;
        } catch (error) {
            LOGGER.error('Data was not mapped. Cause: %s', error);
            throw new Error('Data was not mapped');
        }
    }

    private static mapBetsFromRedis(betsFromRedis: Record<string, string>): IBetData[] {
        let betsRouletteList: IBetData[] = [];
        for (let id in betsFromRedis) {
            const bet = JSON.parse(betsFromRedis[id]);
            const betData = {
                id,
                bet
            } as IBetData;
            betsRouletteList.push(betData);
        }
        return betsRouletteList;
    }

}
