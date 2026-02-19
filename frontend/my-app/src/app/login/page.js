'use client'
import { useState } from "react";

// Example Teacher Login for testing
//   "email": "arun@teacher.com",
//   "password": "test123456",
// Example student Login for testing 
//   "email": "student@example.com",
//   "password": "student123",
export default function Login() {
    if(localStorage.getItem('token')){
        setTimeout(()=>window.location.href="/",1000);
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // console.log("Current Email ",email);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            console.log('Button clicked, sending:', { email, password });
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });
            console.log("Got response");
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert("Token Saved");
                console.log("Token Saved", data.token);
                window.location.href="/";
            } else {
                alert('Login Failed' + (data.msg || "Internal Server Error"));
            }
        } catch (error) {
            console.log(error);
            alert('Server Error');
        }
    }


    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}