import { getProfile } from "./auth";

export default async function getUserProfile(token: string) {
  return getProfile(token);
}
