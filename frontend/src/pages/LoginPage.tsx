import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVerificationNeeded, setIsVerificationNeeded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setIsVerificationNeeded(true);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Google accounts are typically pre-verified, but let's check anyway
      if (!userCredential.user.emailVerified) {
        await signOut(auth);
        setIsVerificationNeeded(true);
      } else {
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login with Google');
    } finally {
      setLoading(false);
    }
  };

  if (isVerificationNeeded) {
    return (
      <div className="min-h-screen bg-ts-bg flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-[0_8px_16px_var(--color-ts-shadow)] text-center">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Email not verified</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-ts-text-muted">
              We have sent you a verification email to <span className="font-semibold text-ts-text-primary">{email}</span>. Please verify it and log in.
            </p>
            <Button className="w-full" onClick={() => setIsVerificationNeeded(false)}>
              Back to Login
            </Button>
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
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <p className="text-sm text-ts-text-muted">Enter your email to sign in to your account</p>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-3 rounded-md bg-[#fcdede] text-[#8a2b2b] text-sm border border-[#e8c3c3]">
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
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
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ts-text-muted">
            <span className="h-px w-full bg-ts-border"></span>
            <span className="shrink-0">OR</span>
            <span className="h-px w-full bg-ts-border"></span>
          </div>
          
          <Button
            variant="outline"
            className="w-full mt-6"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            Sign in with Google
          </Button>

          <p className="mt-6 text-center text-sm text-ts-text-muted">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-ts-peach hover:underline">
              Request access
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
