import { Expose } from 'class-transformer';
import { Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserEntity } from '../../users';
import { MAX_LENGTHS } from '../Questions.constants';

@Entity({ name: 'questions' })
@Index('IDX_questions_userId_createdAt', ['user', 'createdAt'])
export class QuestionEntity {
  @Expose()
  @PrimaryGeneratedColumn({ primaryKeyConstraintName: 'PK_questions_id' })
  id: number;

  @Expose()
  @Column({ type: 'varchar', length: MAX_LENGTHS.questionTitle })
  title: string;

  @Expose()
  @Column({ type: 'text' })
  contentHtml: string;

  @Expose()
  @CreateDateColumn()
  createdAt: Date;

  @Expose()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, user => user.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', foreignKeyConstraintName: 'FK_questions_userId_users_id' })
  user: UserEntity;
}
