'use client'
import { useState } from "react";
export default function Register(){
    const [username,setUsername] = useState('');
    const [email,setEmail] = useState('');
    const [password,setPassword]=useState('');
    const [role,setRole] = useState('student');

    const handleRegister = async (e)=>{
        e.preventDefault();
        console.log("Sending data to backend");
        try{
            const response= await fetch("http://localhost:5000/auth/register",{
                method: 'POST',
                headers: {
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({username,email,password,role})
            });
            const data= await response.json();
            if(response.ok){
                localStorage.setItem('token',data.token);
                alert("Registration Successful!! Token Saved");
                setTimeout(()=>window.location.href="/",2000);
                console.log(data.token);
            }else{
                alert('Registration failed: '+(data.msg||"Internal Server Error"));
            }
        }catch(error){
            console.log("Error:",error);
            alert("Server error");
        }
    }

    return (
        <div>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label>Username</label>
                    <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
                </div>
                <div>
                    <label>Email</label>
                    <input type="email" placeholder="email" value={email} onChange={(e)=>setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
                </div>
                <div>
                    <label>Role:</label>
                    <select value={role} onChange={(e)=>setRole(e.target.value)}>
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                    </select>
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    );
}