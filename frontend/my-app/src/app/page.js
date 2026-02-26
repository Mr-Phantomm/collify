'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/navbar/Navbar";
import Herosection from "../components/hero-section/Herosection";

export default function Home() {
  // const router = useRouter();
  // useEffect(()=>{
  //   const token = localStorage.getItem("token");
  //   if(token){
  //     router.push("/dashboard");
  //   }
  //   else router.push("/login");
  // },[router]);

  return (
  <>
    <Navbar />
    <Herosection />
    </>
  );
}
