'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/stanger-user-dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-body">
      <div className="circle circle1"></div>
      <div className="circle circle2"></div>

      <div className="login-container">
        <div className="logo">🛒</div>

        <h2>Admin Panel</h2>
        <div className="subtitle">
          Grocery Deals Management System
        </div>

        {error && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem', background: '#fee2e2', color: '#dc2626', borderRadius: '12px', fontSize: '13px', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="input-box">
            <label>Username / Email</label>
            <input 
              type="text" 
              placeholder="admin" 
              required 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-box">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="Enter your password" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Authenticating...' : 'Secure Login'}
          </button>
        </form>

        <div className="bottom-text">
          © 2026 Grocery Deals Admin
        </div>
      </div>

      <style jsx>{`
        .login-body {
          height: 100vh;
          width: 100vw;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg,#f3fff5,#e8fff0,#ffffff);
          overflow: hidden;
          position: relative;
          margin: 0;
          padding: 0;
          font-family: 'Poppins', sans-serif;
        }

        .circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(34,197,94,0.12);
          filter: blur(5px);
        }

        .circle1 {
          width: 260px;
          height: 260px;
          top: -80px;
          left: -80px;
        }

        .circle2 {
          width: 220px;
          height: 220px;
          bottom: -70px;
          right: -70px;
        }

        .login-container {
          width: 380px;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.4);
          border-radius: 24px;
          padding: 40px 35px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.08);
          position: relative;
          z-index: 2;
        }

        .logo {
          width: 75px;
          height: 75px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: auto;
          font-size: 34px;
          color: #fff;
          box-shadow: 0 8px 20px rgba(34,197,94,0.35);
        }

        h2 {
          text-align: center;
          margin-top: 20px;
          color: #111827;
          font-size: 28px;
          font-weight: 600;
        }

        .subtitle {
          text-align: center;
          margin-top: 8px;
          margin-bottom: 30px;
          color: #6b7280;
          font-size: 14px;
        }

        .input-box {
          margin-bottom: 18px;
        }

        .input-box label {
          display: block;
          margin-bottom: 8px;
          color: #374151;
          font-size: 14px;
          font-weight: 500;
        }

        .input-box input {
          width: 100%;
          padding: 14px 16px;
          border: none;
          border-radius: 14px;
          background: #f3f4f6;
          font-size: 14px;
          transition: 0.3s;
        }

        .input-box input:focus {
          outline: none;
          background: #fff;
          border: 1px solid #22c55e;
          box-shadow: 0 0 0 4px rgba(34,197,94,0.12);
        }

        .login-btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 14px;
          background: linear-gradient(135deg,#22c55e,#16a34a);
          color: #fff;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 10px;
          transition: 0.3s;
          box-shadow: 0 8px 18px rgba(34,197,94,0.25);
        }

        .login-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 22px rgba(34,197,94,0.35);
        }

        .login-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .bottom-text {
          text-align: center;
          margin-top: 22px;
          font-size: 13px;
          color: #9ca3af;
        }

        @media(max-width:450px) {
          .login-container {
            width: 90%;
            padding: 35px 25px;
          }
        }
      `}</style>
    </div>
  );
}
