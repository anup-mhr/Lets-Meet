import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: "users" })
export class User {
  @PrimaryGeneratedColumn()
  user_id!: number;

  @Column({ nullable: false })
  username!: string;

  @Column({ nullable: false })
  email!: string;

  @Column({ nullable: false })
  password!: string;
}
