import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  let token;

  // Cek apakah ada header authorization dengan Bearer token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak, token tidak ada' });
  }

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_default');
    
    // Simpan id user ke request untuk dipakai di controller
    req.user = decoded; 
    next();
  } catch {
    res.status(401).json({ message: 'Token tidak valid atau sudah kadaluarsa' });
  }
};
