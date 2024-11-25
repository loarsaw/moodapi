import { EMAIL, USERS } from "../../lib/constants";
import { Singleton } from "../../lib/singleton";
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
@Singleton
class AuthService {
  async findUserByEmail({ email }: { email: string }): Promise<any> {
    try {
      console.log(email);
    } catch (error) {
      console.log(error);
    }
  }
}

export default new AuthService();
