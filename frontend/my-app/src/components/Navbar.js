"use client"

import { useEffect,useState } from "react"
import { useRouter } from 'next/navigation'
import Image from "next/image";

export default function Navbar(){
    const router = useRouter();
    const [isLoggedIn,setIsLoggedIn]=useState(false);
    useEffect(()=>{
        const token = localStorage.getItem("token");
        if(token)setIsLoggedIn(true);
    },[]);

    const handleLogout = ()=>{
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setIsLoggedIn(false);
        router.push('/');
    }

    return (
        <nav className="">
            <div className="">
                <Image src="/RemovedBackgroudCollifyLogo.png" alt="Collify Logo" width={140} height={40} priority className="cursor-pointer" onDoubleClickCapture={()=>router.push('/')}></Image>
            </div>

        </nav>
    )
    
}