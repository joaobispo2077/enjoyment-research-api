import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendEmailService from "../services/SendEmailService";
import { resolve } from 'path';

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

      const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs");

      const variables = {
        name: user.name,
        title: survey.title,
        description: survey.description,
        user_id: user.id,
        link: process.env.URL_MAIL
      }

      const surveyUsersAlreadyExists = await surveysUsersRepository.findOne({
        where: [{user_id: user.id}, {value: null}],
        relations: ["user", "survey"]
      });

      if(surveyUsersAlreadyExists) {
        const previewURL = await SendEmailService.execute(email, survey.title, variables, npsPath);
        return response.status(201).json({surveyUser: surveyUsersAlreadyExists, previewURL});
      }

      await surveysUsersRepository.save(surveyUser);

      const previewURL = await SendEmailService.execute(
        email, 
        survey.title, 
        variables,
        npsPath, 
      );
  
      return response.json({surveyUser, previewURL});
    }
    catch(err) {
      console.log(err);
      return response.status(500).json({ message: err.message });
    }
  }
}

export { SendEmailController };