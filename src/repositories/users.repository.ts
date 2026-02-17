import User from '../models/User';

export class UsersRepository {
  async existsById(_id: string): Promise<boolean> {
    const result = await User.exists({ _id });
    return result !== null;
  }
}
