import { sign } from 'jsonwebtoken';

const generateAccessToken = (id: string) => {
  return sign({ id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '15m' });
};

const generateRefreshToken = (id: string) => {
  return sign({ id }, process.env.JWT_PRIVATE_KEY, { expiresIn: '1d' });
};

export { generateAccessToken, generateRefreshToken };
