import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { UsersRepository } from "../repositories/UsersRepository";
import * as yup from "yup";

class UserController {
  async create(request: Request, response: Response) {
    try {
      const {name, email} = request.body;
  
      const schema = yup.object().shape({
        name: yup.string().required("O nome é obrigatório"),
        email: yup.string().email().required(),
      });
  
      // if(!(await schema.isValid(request.body))) {   
      //   return response.status(400).json({ message: "Failed Validation"})
      // }

      await schema.validate(request.body, 
        { abortEarly: false }); // return all errors found.
  
      const usersRepository = getCustomRepository(UsersRepository);
  
      const userAlreadyExists = await usersRepository.findOne({
        email
      });
  
      if(userAlreadyExists) {
        return response.status(400).json({error: "Users already exists"});
      }
  
      const user = usersRepository.create({
        name, email
      });
  
      await usersRepository.save(user);
  
      return response.status(201).json(user);

    }
    catch(err) {
      console.log(err)
      if(err.name === "ValidationError")
        return response.status(400).json({error: err.errors});
      console.log(err)
      return response.status(500).json({message: 'internal server error'});
    }
  }
}


export { UserController };
