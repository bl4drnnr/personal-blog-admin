import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { enableMfa, getMfaEnrollment, login, verifyMfa, type MfaEnrollment } from '@/api/auth';
import { ApiError } from '@/api/client';

type Step =
  | { kind: 'credentials' }
  | { kind: 'mfa-verify'; tempToken: string }
  | { kind: 'mfa-setup'; tempToken: string; enrollment: MfaEnrollment };

type CopyState = 'idle' | 'copied' | 'failed';

/**
 * The QR only helps if you are enrolling with a phone camera. A password manager
 * wants the key as text, so show it too — and make it a one-click copy, because
 * a mistyped base32 character fails at verification with no clue why.
 */
function SetupKey({ secret }: { secret: string }) {
  const [copy, setCopy] = useState<CopyState>('idle');

  // Absent in insecure contexts, where the property access itself throws.
  const copySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopy('copied');
    } catch {
      setCopy('failed');
    }
    window.setTimeout(() => setCopy('idle'), 2000);
  };

  return (
    <div className="setup-key">
      <span className="setup-key-label">Setup key</span>
      {/* user-select: all — a single click grabs the whole key if copying fails. */}
      <code>{secret}</code>
      <button type="button" className="btn ghost small" onClick={copySecret}>
        {copy === 'copied' ? 'Copied' : copy === 'failed' ? 'Copy failed' : 'Copy'}
      </button>
    </div>
  );
}

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) {
      return 'Incorrect credentials or code.';
    }
    if (err.status === 429) {
      return 'Too many attempts. Wait a minute and try again.';
    }
  }
  return 'Something went wrong. Try again.';
}

export function LoginPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>({ kind: 'credentials' });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submitCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const res = await login(email, password);
      if (res.mfaSetupRequired) {
        const enrollment = await getMfaEnrollment(res.tempToken);
        setStep({ kind: 'mfa-setup', tempToken: res.tempToken, enrollment });
      } else {
        setStep({ kind: 'mfa-verify', tempToken: res.tempToken });
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  const submitCode = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step.kind === 'credentials') {
      return;
    }
    setError('');
    setBusy(true);
    try {
      if (step.kind === 'mfa-setup') {
        await enableMfa(step.tempToken, code);
      } else {
        await verifyMfa(step.tempToken, code);
      }
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <h1 className="login-wordmark">BLOG ADMIN</h1>

        {step.kind === 'credentials' && (
          <form onSubmit={submitCredentials} className="login-form">
            <label>
              <span>Email</span>
              <input
                type="email"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </label>
            <label>
              <span>Password</span>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn primary" disabled={busy}>
              {busy ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        )}

        {step.kind === 'mfa-setup' && (
          <form onSubmit={submitCode} className="login-form">
            <p className="login-hint">
              Scan the QR with an authenticator app, or add the setup key to a password manager.
              Then enter the 6-digit code to finish setup.
            </p>
            <img className="qr" src={step.enrollment.qrDataUrl} alt="MFA QR code" />
            <SetupKey secret={step.enrollment.secret} />
            <label>
              <span>Authentication code</span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn primary" disabled={busy || code.length !== 6}>
              {busy ? 'Verifying…' : 'Enable MFA & sign in'}
            </button>
          </form>
        )}

        {step.kind === 'mfa-verify' && (
          <form onSubmit={submitCode} className="login-form">
            <p className="login-hint">Enter the 6-digit code from your authenticator app.</p>
            <label>
              <span>Authentication code</span>
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                required
                autoFocus
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn primary" disabled={busy || code.length !== 6}>
              {busy ? 'Verifying…' : 'Verify'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
