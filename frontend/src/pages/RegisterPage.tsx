import { useState } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });
      
      // Send verification email
      await sendEmailVerification(user);
      
      // Sign out immediately so they aren't logged in unverified
      await signOut(auth);

      // Show the verification screen
      setIsVerificationSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationSent) {
    return (
      <div className="min-h-screen bg-ts-bg flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-[0_8px_16px_var(--color-ts-shadow)] text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-ts-text-muted">
              We have sent you a verification email to <span className="font-semibold text-ts-text-primary">{email}</span>. Please verify it and log in.
            </p>
            <Link to="/login" className="block">
              <Button className="w-full">Go to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ts-bg flex flex-col items-center justify-center p-4">
      <Link to="/" className="mb-8 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-ts-peach flex items-center justify-center shadow-inner">
          <span className="font-bold text-white text-lg leading-none">T</span>
        </div>
        <span className="font-bold text-xl tracking-tight text-ts-text-primary">TrueScan</span>
      </Link>
      
      <Card className="w-full max-w-md shadow-[0_8px_16px_var(--color-ts-shadow)]">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Request Access</CardTitle>
          <p className="text-sm text-ts-text-muted">Create a new operator account</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-[#fcdede] text-[#8a2b2b] text-sm border border-[#e8c3c3]">
              {error}
            </div>
          )}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-ts-text-primary">Full Name</label>
              <Input
                type="text"
                placeholder="Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-ts-text-primary">Email</label>
              <Input
                type="email"
                placeholder="officer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2 relative">
              <label className="text-sm font-medium text-ts-text-primary">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-ts-text-muted hover:text-ts-text-primary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  )}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full shadow-[0_4px_14px_rgba(232,168,149,0.4)]" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ts-text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-ts-peach hover:underline">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
