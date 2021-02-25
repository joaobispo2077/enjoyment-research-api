import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendEmailService from "../services/SendEmailService";

class SendEmailController {
  async execute(request: Request, response: Response) {
    try {

      const { email, survey_id } = request.body;
  
      const usersRepository = getCustomRepository(UsersRepository);
      const surveysRepository = getCustomRepository(SurveysRepository);
      const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);
  
      const user = await usersRepository.findOne({ email });
  
      if (!user) {
        return response.status(400).json({
          message: "User does not exists"
        });
      }
  
      const survey = await surveysRepository.findOne({ id: survey_id });
  
      if (!survey) {
        return response.status(400).json({
          message: "Survey does not exists"
        });
      }
  
      const surveyUser = surveysUsersRepository.create({
        user_id: user.id,
        survey_id
      });
  
      await surveysUsersRepository.save(surveyUser);
      console.log('user', user)
      console.log('survey', survey)
      await SendEmailService.execute(
        email, 
        survey.title, 
        survey.description, 
      );
  
      return response.json(surveyUser);
    }
    catch(err) {
      console.log(err);
      return response.status(500).json({ message: err.message });
    }
  }
}

export { SendEmailController };