import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
  { duration: '10s', target: 200 },
  { duration: '10s', target: 500 },
  { duration: '10s', target: 800 },
  { duration: '10s', target: 1000 },
  { duration: '10s', target: 1500 },
  { duration: '10s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

export default function () {
  const loginRes = http.post(
    'http://localhost:3000/login',
    JSON.stringify({
      email: 'teste@email.com',
      password: '123456',
    }),
    {
      headers: { 'Content-Type': 'application/json' },
    }
  );

  const token = loginRes.json('token');

  check(loginRes, {
    'login OK': (r) => r.status === 200,
    'token recebido': () => token !== undefined,
  });

  const dadosRes = http.get('http://localhost:3000/dados', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  check(dadosRes, {
    'acesso OK': (r) => r.status === 200,
  });

  sleep(1);
}