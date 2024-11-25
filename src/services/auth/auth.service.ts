import { EMAIL, USERS } from "../../lib/constants";
import { Singleton } from "../../lib/singleton";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import databaseService from "../database/database.service";
@Singleton
class AuthService {
  async findUserByEmail({ email }: { email: string }): Promise<any> {
    try {
      console.log(email);
      const user = await databaseService.get_single_document(
        email,
        USERS,
        EMAIL
      );
      return user;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new AuthService();
