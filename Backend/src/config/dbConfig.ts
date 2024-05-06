import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User";
import { ChatUsers } from "../models/ChatUsers";
import { Message } from "../models/Message";

dotenv.config();
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DATABASE, NODE_ENV, DB_URL } = process.env;

let connectionData;

if (NODE_ENV === "dev") {
  connectionData = {
    host: DB_HOST,
    port: parseInt(DB_PORT || "5432", 10),
    username: DB_USER,
    password: DB_PASSWORD,
    database: DATABASE,
  };
} else {
  connectionData = {
    url: DB_URL,
  };
}

export const AppDataSource = new DataSource({
  type: "postgres",
  ...connectionData,
  synchronize: true,
  logging: NODE_ENV === "dev" && true,
  entities: [User, ChatUsers, Message],
  subscribers: [],
  migrations: [],
});
