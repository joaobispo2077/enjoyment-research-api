import {  Connection, createConnection, getConnectionOptions  } from "typeorm";

const _getDatabase = (defaultOptions: any) => {
  return process.env.NODE_ENV === "test" ? 
  `./src/database/database.${process.env.NODE_ENV}.sqlite` : 
  defaultOptions.database;
}

export default async (): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  const database = _getDatabase(defaultOptions);

  return createConnection(
    Object.assign(defaultOptions, {
      database: database 
    })
  );
}