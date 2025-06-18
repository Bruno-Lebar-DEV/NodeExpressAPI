import bcrypt from 'bcryptjs';

const getPepper = () => process.env.PASSWORD_PEPPER || '';

export async function hashPassword(password) {
  const pepper = getPepper();
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password + pepper, salt);
}

export async function comparePassword(candidatePassword, hashedPassword) {
  const pepper = getPepper();
  return bcrypt.compare(candidatePassword + pepper, hashedPassword);
}
