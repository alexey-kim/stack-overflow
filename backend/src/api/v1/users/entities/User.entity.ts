import bcrypt from 'bcryptjs';
import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from 'typeorm';
import { QuestionEntity } from '../../questions';
import { MAX_LENGTHS } from '../Users.constants';

@Entity({ name: 'users' })
@Unique('UQ_users_username', ['username'])
@Index('IDX_users_username', ['username'])
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_users_id' })
  id: number;

  @Expose()
  @Column({ type: 'varchar', length: MAX_LENGTHS.username })
  username: string;

  // Exclude password so that it is not exposed to the client
  @Exclude()
  @Column({ type: 'varchar', length: MAX_LENGTHS.password })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    // Hash password so that it is not stored in plain text in the database
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => QuestionEntity, question => question.user)
  questions: QuestionEntity[];
}
