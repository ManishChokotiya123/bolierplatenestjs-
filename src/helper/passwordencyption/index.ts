import { compare, hash } from 'bcrypt';

export async function createpasswordhash(data) {
  return await hash(data, 10);
}

export async function comparepassword(password: string, hashPassword: string) {
  return await compare(password, hashPassword);
}
