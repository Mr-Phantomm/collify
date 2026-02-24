'use client'
import Link from "next/link";
import { useState,useEffect } from "react";

// Example Teacher Login for testing
//   "email": "arun@teacher.com",
//   "password": "test123456",
// Example student Login for testing 
//   "email": "student@example.com",
//   "password": "student123",
export default function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
            setToken(storedToken);
            window.location.href = "/";
        }
    }, []);
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
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white space-y-8 p-8 rounded-xl shadow-xl">
            <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 ">Login</h1>
            <form onSubmit={handleLogin} className="">
                <div>
                <label htmlFor="emailInput" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="emailInput" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                </div>
                <div>
                <label htmlFor="passWord" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input type="password" id="passWord" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"/>
                </div>
                <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transtion-colors mt-2">Login</button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-600">
                Don't have an Account ?<Link href="/register" className="text-indigo-600 hover:underline"> Register here</Link> 
            </p>
        </div>
    </div>
    )
}