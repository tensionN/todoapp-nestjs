import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Todo } from '../todo/todo.entity';
import * as bcrypt from 'bcrypt';
@Entity({ name: 'Users', schema: 'public' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ default: false })
  public isMailConfirmed: boolean;

  @OneToMany(() => Todo, (todo) => todo.user)
  todo: Todo[];

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }
}
