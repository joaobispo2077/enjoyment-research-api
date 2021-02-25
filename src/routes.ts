import { Router } from 'express';
import { SendEmailController } from './controllers/SendEmailController';
import { SurveysController } from './controllers/SurveysController';
import { UserController } from "./controllers/UserController";


const router = Router();

const userController = new UserController();
const surveyController = new SurveysController();
const sendEmailController = new SendEmailController();

router.post("/users", userController.create);

router.post("/surveys", surveyController.create);
router.get("/surveys", surveyController.show);

router.post("/sendEmail", sendEmailController.execute);

export { router };
