import { Request, Response } from "express";
import { getCustomRepository, IsNull, Not } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

interface SurveyUser {
  id: string;
  user_id: string;
  survey_id: string;
  value: number;
  created_at: Date;
}

const _getDetractors = (survey: SurveyUser) => (survey.value >= 0 && survey.value <= 6);
const _getPassives = (survey: SurveyUser) => (survey.value >= 7 && survey.value <= 8);
const _getPromoters = (survey: SurveyUser) => (survey.value >= 9 && survey.value <= 10);

const calculateNPS = (
  detractors: number,
  promoters: number,
  totalAnswers: number,
) => {
  return Number((((promoters - detractors) / (totalAnswers)) * 100).toFixed(2))
}

class NpsController {
  // Calcúlo de NPS.
  // Detratores => 0 - 6
  // Passivos => 7 - 8
  // Promotores => 9 - 10
  // NPS = (Número de Promotores - número de detradores) / (número de respondentes) * 100
  async execute(request: Request, response: Response) {
    const { survey_id } = request.params;

    const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

    const surveysUsers = await surveysUsersRepository.find({ survey_id, value: Not(IsNull()) });

    const detractors = surveysUsers.filter(_getDetractors).length;
    const passives = surveysUsers.filter(_getPassives).length;
    const promoters = surveysUsers.filter(_getPromoters).length;

    const totalAnswers = surveysUsers.length;

    console.log(detractors, passives, promoters);

    const NPS = calculateNPS(detractors, promoters, totalAnswers);

    return response.json({
      promoters, 
      detractors, 
      passives, 
      totalAnswers, 
      NPS
    })
  }
}

export { NpsController };