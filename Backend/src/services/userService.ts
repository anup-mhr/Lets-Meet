import { User } from "../models/User";
import { AppDataSource } from "../config/dbConfig";
import logger from "../utils/logger";
import bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import AppError from "../utils/AppError";

const signToken = (id: number, expireTime: string) => {
  if (!process.env.JWT_SECRET) {
    logger.fatal("JWT_SECRET not defined in env variable");
    throw new AppError("Internal Server Error", 500);
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: expireTime,
  });
};

export const userService = {
  getUserIdByToken(token: string) {
    if (!process.env.JWT_SECRET) {
      logger.fatal("JWT_SECRET not defined in env variable");
      throw new AppError("Internal Server Error", 500);
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    return decoded.id;
  },

  async createUser(userData: Partial<User>): Promise<User | undefined> {
    try {
      if (!userData.email || !userData.password || !userData.username) {
        throw new AppError("Insufficient information", 400);
      }

      //hashing the password
      userData.password = await bcrypt.hash(userData.password, 12);

      const userRepository = AppDataSource.getRepository(User);
      const data = await userRepository.save(userData);

      logger.info(`New user created with user_id: ${data.user_id}`);
      return data;
    } catch (error) {
      logger.error(error, "something wrong in while creating user");
      throw error;
    }
  },

  async login(userData: Partial<User>): Promise<{ token: string; username: string }> {
    try {
      const { email, password } = userData;
      if (!email || !password) {
        throw new AppError("Please provide email and password", 400);
      }

      //2) check if user exist and password is correct
      const userRepository = AppDataSource.getRepository(User);
      const user = await userRepository.findOneBy({
        email,
      });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new AppError("Invalid email or password", 401);
      }

      // 3) if everything is ok send token to user
      if (!process.env.JWT_EXPIRES_IN) {
        throw new AppError("JWT expire date not given", 500);
      }
      const token = signToken(user.user_id, process.env.JWT_EXPIRES_IN);
      logger.info({ user: user.user_id }, "User logged in Successfully");

      const username = user.username;
      return { token, username };
    } catch (error) {
      logger.error(error, "something wrong in while logging");
      throw error;
    }
  },

  async getUserById(id: number): Promise<User> {
    try {
      const userRepository = AppDataSource.getRepository(User);
      const data = await userRepository.findOneBy({ user_id: id });
      if (!data) throw new AppError("User not found", 404);
      logger.info(data.user_id, "fetched user data of user_id");
      return data;
    } catch (error) {
      logger.info("Error occured while getting user");
      throw error;
    }
  },

  async getUsername(id: number): Promise<string> {
    try {
      const userRepository = AppDataSource.getRepository(User);

      const data = await userRepository.findOneBy({ user_id: id });
      if (!data) throw new AppError("User not found", 404);
      return data.username;
    } catch (error) {
      logger.info("Error occured while getting username");
      throw error;
    }
  },
};
