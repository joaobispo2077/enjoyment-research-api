import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class AnswerController {
  async execute(request: Request, response: Response){

    const { value } = request.params;
    const surveyUsersID = request.query.surveysUsers;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveyUser = await surveysUsersRepository.findOne({
      id: String(surveyUsersID)
    });

    if(!surveyUser) {
      return response.status(400).json({
        message: "Survey user does not exists!"
      });
    }

    surveyUser.value = Number(value);

    await surveysUsersRepository.save(surveyUser);

    return response.json(surveyUser);

  }

}

export { AnswerController };