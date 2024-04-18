import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "messages" })
export class Message {
  @PrimaryGeneratedColumn()
  message_id!: number;

  @Column({ nullable: false })
  room!: string;

  @Column({ nullable: false })
  username!: string;

  @Column({ type: "text", nullable: false })
  message!: string;

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  _createdtime_!: Date;
}
