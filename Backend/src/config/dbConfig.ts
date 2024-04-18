import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../models/User";
import { ChatUsers } from "../models/ChatUsers";
import { Message } from "../models/Message";

dotenv.config();
const { DB_URL, NODE_ENV } = process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  url: DB_URL,
  synchronize: true,
  logging: NODE_ENV === "dev" && true,
  entities: [User, ChatUsers, Message],
  subscribers: [],
  migrations: [],
});
