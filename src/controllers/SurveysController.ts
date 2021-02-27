import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";

class SurveysController {
  async create(request: Request, response: Response) {
    try {
      const { title, description } = request.body;
  
      const surveysRepository = getCustomRepository(SurveysRepository);
      
      const survey = surveysRepository.create({title, description});

      await surveysRepository.save(survey);
      
      return response.status(201).json(survey);
    }
    catch(err) {
      console.log('ERROR when create survey', err);
      return response.status(500).end();      
    }
  }

  async show(request: Request, response: Response) {
    const surveysRepository = getCustomRepository(SurveysRepository);

    const surveys = await surveysRepository.find();
    
    return response.status(200).json(surveys);
  }
}

export { SurveysController }