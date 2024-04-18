import { AppDataSource } from "../config/dbConfig";
import { Message } from "../models/Message";
import AppError from "../utils/AppError";

export const messageService = {
  async createMessage(
    message: string,
    room: string,
    username: string,
    _createdtime_: Date,
  ): Promise<Message> {
    console.log(_createdtime_);
    const messageData: Partial<Message> = { message, username, room };
    const messageRepository = AppDataSource.getRepository(Message);
    const data = await messageRepository.save(messageData);
    return data;
  },

  async getMessageByRoom(room: string): Promise<Message[]> {
    try {
      const messageRepository = await AppDataSource.getRepository(Message)
        .createQueryBuilder("message")
        .where(`room='${room}'`)
        .getMany();
      return messageRepository;
    } catch (error) {
      throw new AppError("Error while getting messages of room", 500);
    }
  },

  async deleteMessageFromRoom(room: string): Promise<void> {
    await AppDataSource.getRepository(Message)
      .createQueryBuilder()
      .delete()
      .from(Message)
      .where(`room = '${room}'`)
      .execute();
  },
};
