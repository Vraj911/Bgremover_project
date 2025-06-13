import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const { token } = req.headers || {};
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token_decode = jwt.decode(token);
    if (!token_decode || !token_decode.clerkId) {
      return res.status(401).json({ message: 'Invalid token payload' });
    }

    req.user = { clerkId: token_decode.clerkId }; // Safe place to store user info
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export default authUser;
