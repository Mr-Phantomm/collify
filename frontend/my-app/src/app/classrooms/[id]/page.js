'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './Classrooms.module.css';
import Navbar from '@/components/navbar/Navbar';

export default function ClassroomDashboard() {
  const router = useRouter()
  const { id } = useParams()
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login')
      return;
    }
    const fetchClassroom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/classroom/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || 'ClassRoom not found');
        }
        setClassroom(data.classroom);
        setUserRole(data.role);
        const postsRes = await fetch(`http://localhost:5000/post/${id}/get`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const postsData = await postsRes.json();
        if (postsRes.ok) {
          console.log(postsData.posts);
          postsData.posts.forEach(element => {
            posts.push(element);
          });
          console.log(posts);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    }
    fetchClassroom();
  }, [id, router]);

  const handleCreatePost = () => {

  }

  if (loading) return <div>Loading Classroom...</div>
  if (error) return <div>Error : {error}</div>
  if (!classroom) return <div>Classroom Not Found</div>

  return (<>
    <Navbar />
    <div className={styles.classroomPage}>

      {/* Header */}
      <div className={styles.classroomHeader}>
        <h1>{classroom.name}</h1>
        <p className={styles.joinCode}>
          Join Code: <strong>{classroom.joinCode}</strong>
        </p>
        <span className={`${styles.roleBadge} ${styles[userRole]}`}>
          {userRole === 'teacher' ? 'Teacher Mode' : 'Student Mode'}
        </span>
      </div>

      {/* Placeholder for future content */}
      <div className={styles.placeholder}>
        <p>Posts, Quizzes, Attendance, and more coming soon...</p>
      </div>
    </div>
  </>
  )
}