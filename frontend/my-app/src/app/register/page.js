'use client'
import Link from "next/link";
import { useState } from "react";
import styles from './Register.module.css';

export default function Register(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [role,setRole] = useState('student');

    const handleRegister = async (e) => {
        e.preventDefault();
        console.log("Sending data to backend");
        try {
            const response = await fetch("http://localhost:5000/auth/register", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password, role })
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert("Registration Successful!! Token Saved");
                setTimeout(() => window.location.href = "/", 2000);
                console.log(data.token);
            } else {
                alert('Registration failed: ' + (data.msg || "Internal Server Error"));
            }
        } catch (error) {
            console.log("Error:", error);
            alert("Server error");
        }
    }

   return (
        <div className={styles['login-page']}>
            <div className={styles['login-card']}>
                {/* Icon Header */}
                <div className={styles['icon-wrapper']}>🎓</div>
                
                <h2>Create Account</h2>
                <p className={styles['subtitle']}>Join us by entering your details below</p>

                <form className={styles['login-form']} onSubmit={handleRegister}>
                    {/* Username Field */}
                    <label>Username</label>
                    <div className={styles['input-group']}>
                        <span className={styles['input-icon']}>👤</span>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Email Field */}
                    <label>Email Address</label>
                    <div className={styles['input-group']}>
                        <span className={styles['input-icon']}>✉️</span>
                        <input 
                            type="email" 
                            placeholder="email@example.com" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    {/* Role Field */}
                    <label>Role</label>
                    <div className={styles['input-group']}>
                        <span className={styles['input-icon']}>💼</span>
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            className={styles['role-select']}
                        >
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    {/* Password Field */}
                    <label>Password</label>
                    <div className={styles['input-group']}>
                        <span className={styles['input-icon']}>🔒</span>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="submit" className={styles['submit-btn']}>
                        Register
                    </button>
                </form>

                <p className={styles['signup-text']}>
                    Already have an account? <Link href="/login"><span>Sign in</span></Link>
                </p>
            </div>
        </div>
    );
}