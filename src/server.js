const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

const PORT = 3000;
const SECRET = '123456';

// usuário fake
const USER = {
  email: 'teste@email.com',
  password: '123456'
};

// ✅ HEALTH CHECK (IMPORTANTE PRO WAIT-ON)
app.get('/', (req, res) => {
  res.status(200).send('API OK');
});

// 🔐 LOGIN
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios' });
  }

  if (email === USER.email && password === USER.password) {
    const token = jwt.sign({ email }, SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Credenciais inválidas' });
});

// 🔒 MIDDLEWARE
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não informado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido' });
  }
}

// 🔐 ROTA PROTEGIDA
app.get('/dados', authMiddleware, (req, res) => {
  res.json({ mensagem: 'Acesso autorizado!' });
});

// 🚀 START
app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});