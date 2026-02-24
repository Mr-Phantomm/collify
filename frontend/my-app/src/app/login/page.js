'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Login.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      window.location.href = '/';
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        window.location.href = '/';
      } else {
        alert(data.msg || 'Login failed');
      }
    } catch (err) {
      alert('Server error');
    }
  };

  return (
    <div className={styles['login-page']}>
      <div className={styles['login-card']}>
        {/* Icon */}
        <div className={styles['icon-wrapper']}>🎓</div>

        {/* Title */}
        <h2>Welcome back</h2>
        <p className={styles.subtitle}>
          Enter your credentials to access your account
        </p>

        {/* Form */}
        <form className={styles['login-form']} onSubmit={handleLogin}>
          <label>Email</label>
          <div className={styles['input-group']}>
            <span className={styles['input-icon']}>🖂</span>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles['password-header']}>
            <label>Password</label>
            <span className={styles.forgot}>Forgot password?</span>
          </div>

          <div className={styles['input-group']}>
            <span className={styles['input-icon']}>🔒︎</span>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span className={styles.eye}>👁</span>
          </div>

          <div className={styles.remember}>
            <input type="checkbox" />
            <span>Remember me for 30 days</span>
          </div>

          <button type="submit" className={styles['submit-btn']}>
            Sign in
          </button>
        </form>

        <div className={styles.divider} />

        <p className={styles['signup-text']}>
          Don&apos;t have an account?{' '}
          <Link href="/register">
            <span>Sign up</span>
          </Link>
        </p>
      </div>
    </div>
  );
}