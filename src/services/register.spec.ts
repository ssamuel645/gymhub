import { expect, describe, it } from 'vitest';
import { RegisterService } from './register';
import { compare } from 'bcryptjs';
import { InMemoryUsersRespository } from '@/repositories/memory/in-memory-users-repository';
import { UserAlreadyExistsError } from './errors/user-already-exists';

describe('Register Service', () => {
  it('should be able to register', async () => {
    const usersRepository = new InMemoryUsersRespository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    expect(user.id).toEqual(expect.any(String));
  });
  
  it('should hash user password upon registration', async () => {
    const usersRepository = new InMemoryUsersRespository();
    const registerService = new RegisterService(usersRepository);

    const { user } = await registerService.execute({
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: '123456',
    });

    const isPasswordHashed = await compare('123456', user.password_hash);

    expect(isPasswordHashed).toBe(true);
  });

  it('should not be able to register with existing email', async () => {
    const usersRepository = new InMemoryUsersRespository();
    const registerService = new RegisterService(usersRepository);

    const email = 'johndoe@email.com';

    await registerService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    });

    await expect(() =>
      registerService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    ).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
