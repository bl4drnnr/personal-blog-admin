import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { ApiError } from '@/api/client';
import { changePassword } from '@/api/site';
import { useToast } from '@/components/toast';

export function SecurityPage() {
  const toast = useToast();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const mutation = useMutation({
    mutationFn: () => changePassword(current, next),
    onSuccess: () => {
      toast('Password changed');
      setCurrent('');
      setNext('');
      setConfirm('');
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) {
        toast('Current password is incorrect.', 'error');
      } else {
        toast('Could not change password.', 'error');
      }
    },
  });

  const mismatch = next !== '' && confirm !== '' && next !== confirm;
  const canSubmit = current !== '' && next.length >= 12 && next === confirm;

  return (
    <div className="page narrow">
      <h1 className="page-h1">Security</h1>

      <form
        className="stacked-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (canSubmit) {
            mutation.mutate();
          }
        }}
      >
        <label className="stacked">
          <span>Current password</span>
          <input
            type="password"
            autoComplete="current-password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
          />
        </label>

        <label className="stacked">
          <span>New password (min 12 characters)</span>
          <input
            type="password"
            autoComplete="new-password"
            value={next}
            onChange={(e) => setNext(e.target.value)}
          />
        </label>

        <label className="stacked">
          <span>Confirm new password</span>
          <input
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

        {mismatch && <p className="form-error">Passwords don&apos;t match.</p>}

        <button type="submit" className="btn primary" disabled={!canSubmit || mutation.isPending}>
          Change password
        </button>
      </form>
    </div>
  );
}
