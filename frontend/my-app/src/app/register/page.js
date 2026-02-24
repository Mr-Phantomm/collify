'use client'
import Link from "next/link";
import { useState } from "react";
export default function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('student');

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
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white space-y-8 p-8 rounded-xl shadow-xl">
                <div>
                    <h2 className="text-center text-3xl font-bold text-gray-900">Create your Account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Already have an account? <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Sign in</Link></p>
                </div>

                <form onSubmit={handleRegister} className="mt-8 space-y-2">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <div className="mt-1">
                            <input type="text" id="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
                        <div className="mt-1">
                            <input type="email" placeholder="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700" htmlFor="password" >Password</label>
                        <div className="mt-1">
                            <input type="password" placeholder="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role:</label>
                         <div className="mt-1">
                        <select value={role} onChange={(e) => setRole(e.target.value)} id="role" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                            <option value="student">Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                        </div>
                    </div>
                    <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transtion-colors mt-2">Register</button>
                </form>
            </div>
        </div>
    );
}