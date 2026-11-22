export const AUTH_MESSAGES = {
  wrongPassword: 'Palavra-passe incorreta.',
  verificationFailed: 'Não foi possível verificar o acesso. Tente novamente mais tarde.',
  networkError: 'Não foi possível contactar o servidor. Tente novamente.',
};

/** Talks to the Netlify `authenticate` function, which sets the session cookie. */
export class AuthClient {
  constructor({ endpoint = '/.netlify/functions/authenticate', fetchImpl } = {}) {
    this.endpoint = endpoint;
    this.fetchImpl = fetchImpl ?? ((...args) => fetch(...args));
  }

  /** @returns {Promise<{ ok: true } | { ok: false, message: string }>} */
  async login(password) {
    try {
      const response = await this.fetchImpl(this.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) return { ok: true };
      return {
        ok: false,
        message:
          response.status === 401 ? AUTH_MESSAGES.wrongPassword : AUTH_MESSAGES.verificationFailed,
      };
    } catch {
      return { ok: false, message: AUTH_MESSAGES.networkError };
    }
  }
}
