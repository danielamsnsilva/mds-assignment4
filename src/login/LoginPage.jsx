import { useRef, useState } from 'react';
import { Blueprint } from '../shared/components/Blueprint.jsx';
import { AuthClient } from './AuthClient.js';

const KANBAN_PAGE = './KanbanFlowLab.html';
const defaultAuthClient = new AuthClient();

function WelcomePanel() {
  return (
    <div className="welcome">
      <p className="eyebrow">Manual interativo · Tema 2</p>
      <h1 id="welcome-heading">Make work flow.</h1>
      <p className="welcome-copy">
        Explore um quadro Kanban, experimente novas formas de trabalhar e acompanhe o impacto das
        suas decisões no fluxo.
      </p>
      <p className="flow-note">Um desafio prático de cada vez</p>
    </div>
  );
}

function LoginForm({ authClient }) {
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');
  const passwordRef = useRef(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setChecking(true);

    const result = await authClient.login(password);
    if (result.ok) {
      window.location.assign(KANBAN_PAGE);
      return;
    }

    setError(result.message);
    setPassword('');
    setChecking(false);
    passwordRef.current?.focus();
  }

  return (
    <div className="form-panel">
      <h2>Bem-vindo!</h2>
      <p className="form-intro">Introduza a palavra-passe para continuar para o FLOW/LAB.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="password">Palavra-passe</label>
        <input
          ref={passwordRef}
          id="password"
          name="password"
          type="password"
          placeholder="A sua palavra-passe"
          autoComplete="current-password"
          required
          autoFocus
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <button type="submit" disabled={checking}>
          {checking ? 'A verificar...' : 'Entrar no FLOW/LAB'}
        </button>
        {error && (
          <p className="access-message" role="alert">
            {error}
          </p>
        )}
      </form>
      <p className="privacy-note">O seu acesso é privado e seguro.</p>
    </div>
  );
}

export function LoginPage({ authClient = defaultAuthClient }) {
  return (
    <main className="page">
      <header className="brand" aria-label="FLOW/LAB">
        <div>
          <p className="brand-name">FLOW/LAB</p>
          <p className="brand-caption">Kanban &amp; flow metrics</p>
        </div>
      </header>

      <Blueprint as="section" className="login-card" aria-labelledby="welcome-heading">
        <WelcomePanel />
        <LoginForm authClient={authClient} />
      </Blueprint>
    </main>
  );
}
