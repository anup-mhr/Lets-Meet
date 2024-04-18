import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity({ name: "chat_users" })
export class ChatUsers {
  @PrimaryColumn()
  socket_id?: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  room!: string;
}
