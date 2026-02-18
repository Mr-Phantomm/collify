'use client'
import { useState } from "react";

export default function Login(){

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    console.log("Current Email ",email);
    return (
        <div>
        <h1>Login</h1>
        <form>
            <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
            <button type="submit">Login</button>
        </form>
        </div>
    )
}