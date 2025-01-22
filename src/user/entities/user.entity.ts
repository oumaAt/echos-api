import { Role } from 'src/utils/enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  comment?: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: string;
}
