import { MigrationInterface, QueryRunner } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export class InsertUsers1737626336764 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const saltRounds = 10;

    const users = [
      {
        username: 'admin',
        password: await bcrypt.hash('admin1234', saltRounds),
        name: 'Admin',
        address: null,
        comment: null,
        role: 'admin',
      },
      {
        username: 'johndoe',
        password: await bcrypt.hash('john1234', saltRounds),
        name: 'John Doe',
        address: 'Paris,France',
        comment: 'nothing to add',
        role: 'user',
      },
      {
        username: 'janedoe',
        password: await bcrypt.hash('jane1234', saltRounds),
        name: 'Jane Doe',
        address: 'Lyon,France',
        comment: 'nothing to add',
        role: 'admin',
      },
    ];

    for (const user of users) {
      await queryRunner.query(
        `INSERT INTO user (username, password, name, address, comment, role) VALUES (?, ?, ?, ?, ?, ?)`,
        [
          user.username,
          user.password,
          user.name,
          user.address,
          user.comment,
          user.role,
        ],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DELETE FROM user WHERE username In ('admin', 'johndoe', 'Janedoe')`);
  }
}
