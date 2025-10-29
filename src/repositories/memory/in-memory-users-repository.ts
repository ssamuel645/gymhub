import { User } from 'generated/prisma/client';
import { UserCreateInput } from 'generated/prisma/models';
import { UsersRepository } from '../users-repository';

export class InMemoryUsersRespository implements UsersRepository {
  public items: User[] = [];
  async create(data: UserCreateInput): Promise<User> {
    const user = {
      id: '1',
      name: data.name,
      email: data.email,
      password_hash: data.password_hash,
      created_at: new Date()
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find(item => item.email === email);

    if (!user) {
      return null;
    }
    
    return user;
  }
}