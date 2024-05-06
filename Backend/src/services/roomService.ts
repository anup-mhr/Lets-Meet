import { ChatUsers } from "../models/ChatUsers";
import { AppDataSource } from "../config/dbConfig";
import AppError from "../utils/AppError";
import logger from "../utils/logger";

export const roomService = {
  async getUsersByRoom(room: string): Promise<string[]> {
    try {
      const userRepository = await AppDataSource.getRepository(ChatUsers)
        .createQueryBuilder()
        .where(`room = '${room}'`)
        .getMany();
      const users = userRepository.map((user) => user.username);
      return users;
    } catch (error) {
      logger.info("Error occured while getting list of username");
      throw error;
    }
  },

  async getUserBySocketId(socket_id: string): Promise<ChatUsers | null> {
    const roomRepository = AppDataSource.getRepository(ChatUsers);
    const data = await roomRepository.findOneBy({ socket_id });
    return data;
  },

  async leaveRoom(socket_id: string): Promise<void> {
    const roomRepository = AppDataSource.getRepository(ChatUsers);
    const data = await roomRepository.findOneBy({ socket_id });
    if (!data) throw new AppError("room not found", 404);
    await roomRepository.remove(data);
  },

  async joinChatRoom(socket_id: string, room: string, username: string): Promise<void> {
    const data = { socket_id, room, username };
    const roomRepository = AppDataSource.getRepository(ChatUsers);
    await roomRepository.save(data);
  },

  async isRoomExist(room: string): Promise<boolean> {
    const roomRepository = AppDataSource.getRepository(ChatUsers);
    const data = await roomRepository.findOneBy({ room: room });
    if (!data) return false;
    return true;
  },

  async getSocketIdByUsername(username: string): Promise<string | undefined> {
    const roomRepository = AppDataSource.getRepository(ChatUsers);
    const data = await roomRepository.findOneBy({ username });
    if (!data) throw new AppError("user not found", 404);
    return data.socket_id;
  },

  async getUsersDataByRoom(room: string): Promise<ChatUsers[]> {
    try {
      const userRepository = await AppDataSource.getRepository(ChatUsers)
        .createQueryBuilder()
        .where(`room = '${room}'`)
        .getMany();
      return userRepository;
    } catch (error) {
      logger.info("Error occured while getting list of username");
      throw error;
    }
  },
};
