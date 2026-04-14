import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 10,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  // 🔐 LOGIN
  const loginRes = http.post('http://localhost:3000/login', JSON.stringify({
    email: 'teste@email.com',
    password: '123456'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  const token = loginRes.json('token');

  check(loginRes, {
    'login OK': (r) => r.status === 200,
    'token recebido': () => token !== undefined,
  });

  // 🔒 ROTA PROTEGIDA
  const dadosRes = http.get('http://localhost:3000/dados', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(dadosRes, {
    'acesso autorizado': (r) => r.status === 200,
  });

  sleep(1);
}
