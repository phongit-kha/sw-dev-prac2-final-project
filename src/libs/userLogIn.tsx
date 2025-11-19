import { loginUser } from "./auth";

export default async function userLogin(email: string, password: string) {
  return loginUser(email, password);
}
