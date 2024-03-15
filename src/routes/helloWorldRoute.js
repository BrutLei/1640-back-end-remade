import express from "express";
import {handleHello} from '../controller/helloController.js'
const router = express.Router(); 

/**
 * @param {*} app: express app
 */
const initWebRoutes = (app) => {
    router.get('/', handleHello)
    return app.use('/', router);
}

export default initWebRoutes;