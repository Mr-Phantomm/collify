'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function ClassroomDashboard() {
  const router = useRouter()
  const { id } = useParams() 
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login')
      return;
    }
    const fetchClassroom = async ()=>{
        try{
            const res = await fetch(`http://localhost:5000/classroom/${id}`,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
          const data=await res.json();

          if(!res.ok){
            throw new Error(data.msg||'ClassRoom not found');
          }
          setClassroom(data.classroom);
          setUserRole(data.role);
        }catch(err){
          setError(err.message);
        } finally{
          setLoading(false);
        }
    }
    fetchClassroom();  
  },[id,router]);

  if(loading)return <div>Loading Classroom...</div>
  if(error)return <div>Error : {error}</div>
  if(!classroom)return <div>Classroom Not Found</div>

  return (
    <div>
      <h1>{classroom.name}</h1>
      <p>Join Code:{classroom.joinCode}</p>

      {userRole === 'student' && (
        <div>
          <h2>ClassRoom Content</h2>
          <p>View Posts,attempt Quizes,check Attendance</p>
        </div>
      )}

      {userRole=== 'teacher' && (
        <div>
          <h2>Teacher Controls</h2>
          <p>View Posts,attempt quizzes,check attendance</p>
        </div>
      )}
      <h2>Posts: </h2>
      <p>(Posts and Quizzes will appear here later)</p>

    </div>
  )

}