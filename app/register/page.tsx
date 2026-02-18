'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { dashboardPathByRole, setSession } from '@/lib/auth';
import { registerInstitute, registerStudent } from '@/services/auth.service';
import { getInstitutes, InstituteOption } from '@/services/institute.service';

type AccountType = 'INSTITUTE' | 'STUDENT';

export default function RegisterPage() {
  const router = useRouter();
  const [accountType, setAccountType] = useState<AccountType>('INSTITUTE');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [instituteName, setInstituteName] = useState('');
  const [description, setDescription] = useState('');
  const [fullName, setFullName] = useState('');
  const [instituteId, setInstituteId] = useState('');
  const [institutes, setInstitutes] = useState<InstituteOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accountType !== 'STUDENT') return;
    const loadInstitutes = async () => {
      try {
        const response = await getInstitutes();
        setInstitutes(response.data || []);
      } catch {
        setInstitutes([]);
      }
    };
    loadInstitutes();
  }, [accountType]);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Password and confirm password must match.');
      setLoading(false);
      return;
    }

    try {
      const response =
        accountType === 'INSTITUTE'
          ? await registerInstitute({
              email,
              password,
              ownerName,
              phone,
              instituteName,
              description,
            })
          : await registerStudent({
              email,
              password,
              fullName,
              phone,
              instituteId,
            });

      setSession(response.data.accessToken, response.data.user);
      router.push(dashboardPathByRole(response.data.user.role));
    } catch {
      setError('Registration failed. Check inputs and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-wrap">
      <div className="auth-card">
        <p className="kicker">Join Exam Adda</p>
        <h1>Create account</h1>
        <p className="subtext">Register as institute owner or student.</p>

        <div className="hero-actions" style={{ marginTop: 10 }}>
          <button
            className={`btn ${accountType === 'INSTITUTE' ? 'primary' : 'ghost'}`}
            type="button"
            onClick={() => setAccountType('INSTITUTE')}
          >
            Institute
          </button>
          <button
            className={`btn ${accountType === 'STUDENT' ? 'primary' : 'ghost'}`}
            type="button"
            onClick={() => setAccountType('STUDENT')}
          >
            Student
          </button>
        </div>

        <form onSubmit={onSubmit} className="form">
          {accountType === 'INSTITUTE' ? (
            <>
              <label className="field">
                Institute Name
                <input type="text" value={instituteName} onChange={(e) => setInstituteName(e.target.value)} required />
              </label>
              <label className="field">
                Owner Name
                <input type="text" value={ownerName} onChange={(e) => setOwnerName(e.target.value)} required />
              </label>
              <label className="field">
                Phone Number
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
              <label className="field">
                Description
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} />
              </label>
            </>
          ) : (
            <>
              <label className="field">
                Student Name
                <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
              </label>
              <label className="field">
                Phone Number
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
              </label>
              <label className="field">
                Institute
                <select value={instituteId} onChange={(e) => setInstituteId(e.target.value)} required>
                  <option value="">Select institute</option>
                  {institutes.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </label>
            </>
          )}

          <label className="field">
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label className="field">
            Password
            <div className="password-wrap">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>
          <label className="field">
            Confirm Password
            <div className="password-wrap">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          {error && <p className="error">{error}</p>}
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create account'}
          </button>
        </form>
      </div>
    </section>
  );
}
