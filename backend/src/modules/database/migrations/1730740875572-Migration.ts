import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1730740875572 implements MigrationInterface {
    name = 'Migration1730740875572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "questions" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "contentHtml" text NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_questions_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_questions_userId_createdAt" ON "questions" ("userId", "createdAt") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_users_username" UNIQUE ("username"), CONSTRAINT "PK_users_id" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_users_username" ON "users" ("username") `);
        await queryRunner.query(`ALTER TABLE "questions" ADD CONSTRAINT "FK_questions_userId_users_id" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "questions" DROP CONSTRAINT "FK_questions_userId_users_id"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_users_username"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_questions_userId_createdAt"`);
        await queryRunner.query(`DROP TABLE "questions"`);
    }

}
