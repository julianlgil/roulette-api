import { Request, Response,  Router } from "express";
import { check, header, validationResult } from 'express-validator';
import RouletteService from "../services/RouletteService";
import {ICreateRouletteResponse} from "../models/ICreateRouletteResponse";
import LoggerUtils from "../utils/LoggerUtils";
import {IBetRequest} from "../models/IBetRequest";
import {IBetResponse} from "../models/IBetResponse";

const router = Router();
const LOGGER = LoggerUtils.createLogger('RouletteController');

router.post('/roulette', (req: Request, res: Response) => {
    LOGGER.info('Creating roulette');
    RouletteService.createRoulette()
        .then(uuid => {
            const response = {rouletteId: uuid} as ICreateRouletteResponse;
            res.status(200).send(response);
        })
        .catch (error => {
            res.status(500).send(error);
        });
});

router.post('/open-roulette',
    [check('rouletteId').isString().isLength({ min: 1, max: 50 })],
    (req: Request, res: Response) => {
    LOGGER.info('Request to open roulette: %j', req.body);
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const errors = err.mapped();
        LOGGER.error('Request error');
        res.status(400).send(errors);
    } else {
        const rouletteId = req.body.rouletteId;
        LOGGER.info('Trying open roulette with id: %s', rouletteId);
        RouletteService.openRoulette(rouletteId)
            .then(result => {
                LOGGER.info('Roulette with id %s was open successfully', rouletteId);
                res.status(200).send();
            }).catch(error => {
            LOGGER.error('Roulette could not be opened. Cause: %s', error.message);
            res.status(401).send();
        });
    }
});

router.post('/bet',
        [check('rouletteId').isString().isLength({ min: 1, max: 50 }),
        check('amount').isInt({min: 1, max: 10000 }),
        check('color').matches('^red$|^black$').optional(),
        check('number').isInt({min:0, max:36}).optional(),
        header('X-UserId').isString().isLength({ min: 1, max: 50 })],
    (req: Request, res: Response) => {
    LOGGER.info('Request to create bet: %j', req.body);
    const err = validationResult(req);
    if (!err.isEmpty()) {
        const errors = err.mapped();
        LOGGER.error('Request error');
        res.status(400).send(errors);
    } else {
        const body = req.body;
        const userId = {userId: req.header('X-Userid')};
        const betRequest = Object.assign({}, userId, body) as IBetRequest;
        LOGGER.info('Trying create bet in roulette with id: %s to client: ', betRequest.rouletteId, betRequest.userId);
        RouletteService.setBet(betRequest)
            .then(betUuid => {
                const response = {betId: betUuid} as IBetResponse;
                LOGGER.info('Bet with id %s was created successfully', betUuid);
                res.status(200).send(response);
            })
            .catch(error => {
                LOGGER.error('Bet could not be created. Cause: %s', error.message);
                res.status(500).send(error.message);
            })
    }
});

router.post('/close-roulette',
    [check('rouletteId').isString().isLength({ min: 1, max: 50 })],
    (req: Request, res: Response) => {
        LOGGER.info('Request to open roulette: %j', req.body);
        const err = validationResult(req);
        if (!err.isEmpty()) {
            const errors = err.mapped();
            LOGGER.error('Request error');
            res.status(400).send(errors);
        } else {
            const rouletteId = req.body.rouletteId;
            LOGGER.info('Trying close roulette with id: %s', rouletteId);
            RouletteService.closeRoulette(rouletteId)
                .then(result => {
                    LOGGER.info('Roulette with id %s was closed successfully', rouletteId);
                    res.status(200).send(result);
                }).catch(error => {
                LOGGER.error('Roulette could not be closed. Cause: %s', error.message);
                res.status(500).send();
            });
        }
    });

router.get('/roulettes', (req: Request, res: Response) => {
    LOGGER.info('Getting roulette list');
    RouletteService.getRouletteList()
        .then(result => {
            res.status(200).send(result);
        })
        .catch (error => {
            res.status(500).send(error);
        });
});
export default router;

