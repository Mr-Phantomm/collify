"use client"

import { useEffect,useState } from "react"
import { useRouter } from 'next/navigation'
// import Image from "next/image";
import styles from "./Navbar.module.css";
import Link from "next/link";

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
        <header className={styles.navbar}>
      {/* LEFT */}
      <div
        className={styles["navbar-left"]}
        onClick={() => router.push("/")}
        style={{ cursor: "pointer" }}
      >
        <div className={styles["logo-icon"]}>
          &lt;/&gt;
        </div>
        <span className={styles["logo-text"]}>Collify</span>
      </div>

      {/* RIGHT */}
      <nav className={styles["navbar-right"]}>
        <Link href="#">Features</Link>
        <Link href="#">How it Works</Link>
        <Link href="#">Assessment</Link>

        {!isLoggedIn ? (
          <>
            <Link href="/login">Log in</Link>
            <button
              className={styles["cta-btn"]}
              onClick={() => router.push("/register")}
            >
              Get Started
            </button>
          </>
        ) : (
          <>
          <Link href="/dashboard">Dashboard</Link>
          <button
            className={styles["cta-btn"]}
            onClick={handleLogout}
          >
            Logout
          </button>
          </>
        )}
      </nav>
    </header>
    )
    
}