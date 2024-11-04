import bcrypt from 'bcryptjs';
import { QuestionEntity } from '../api/v1/questions';
import { UserEntity } from '../api/v1/users';
import { AppDataSource } from '../modules/database';

export const seedData = async () => {
  const usersRepository = AppDataSource.getRepository(UserEntity);

  // Exit if there are existing users in the database
  if (await usersRepository.exists({})) {
    return;
  }

  // Create users

  const usersTotal: number = 1000;

  const users: UserEntity[] = [];

  const hashedPassword: string = await bcrypt.hash('password', 10);

  for (let userId = 1; userId <= usersTotal; userId += 1) {
    users.push({
      username: `username${userId}`,
      password: hashedPassword,
    } as UserEntity);
  }

  const savedUsers: UserEntity[] = await usersRepository.save(users);

  console.log(`${savedUsers.length} users have been created`);

  // Create questions

  const questionsPerUserTotal: number = 100;

  const questionsRepository = AppDataSource.getRepository(QuestionEntity);

  for (const user of savedUsers) {
    const questions: QuestionEntity[] = [];

    for (let questionId = 1; questionId <= questionsPerUserTotal; questionId += 1) {
      questions.push({
        title: `Question Title ${questionId} from userId ${user.id}`,
        contentHtml: `<p>Question Content ${questionId} from userId ${user.id}</p>`,
        user,
      } as QuestionEntity);
    }

    const savedQuestions: QuestionEntity[] = await questionsRepository.save(questions);
    console.log(`${savedQuestions.length} questions have been created for userId ${user.id}`);
  }
};
