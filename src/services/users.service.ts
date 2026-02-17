import { UsersRepository } from '../repositories/users.repository';
import { AppError, EErrorCode } from '../types';

export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async isUserExists(userId: string): Promise<void> {
    const exists = await this.usersRepository.existsById(userId);

    if (!exists) {
      throw new AppError(EErrorCode.RESOURCE_NOT_FOUND, `User with id '${userId}' not found`);
    }
  }
}
