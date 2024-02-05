import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { JoinColumn } from 'typeorm';

@Entity({ name: 'Todo', schema: 'public' })
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  describe: string;
  
  @Column({ name: 'user_id' })
  user_id: number;
  
  @ManyToOne(() => User, (user) => user.todo)
  @JoinColumn({ name: 'user_id' })
  user: User;
}