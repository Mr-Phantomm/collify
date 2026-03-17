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
  const [posts,setPosts] = useState([]);
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
          const postsRes = await fetch(`http://localhost:5000/post/${id}/get`,{
            headers:{
              'Authorization':`Bearer ${token}`
            }
          });
          const postsData = await postsRes.json();
          if(postsRes.ok){
            console.log(postsData.posts);
            postsData.posts.forEach(element => {
              posts.push(element);
            });
            console.log(posts);
          }
        }catch(err){
          setError(err.message);
        } finally{
          setLoading(false);
        }
        
    }
    fetchClassroom();  
  },[id,router]);

  const handleCreatePost =()=>{

  }

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
      {posts.length === 0 ? (
        <p>No Posts Yet</p>
      ) : (
        <ul>
        {posts.map(post => (
      <li key={post._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee' }}>
        <h3>{post.title}</h3>
        <p>{post.content}</p>
        <small>By {post.author.username} on {new Date(post.createdAt).toLocaleDateString()}</small>

        {post.type === 'google_meet' && post.meetLink && (
          <p>
            <a href={post.meetLink} target="_blank" rel="noopener noreferrer">
              Join Google Meet
            </a>
          </p>
        )}

        {post.type === 'quiz' && post.quizId && (
          <p>Quiz: {post.quizId.title} (Attempt now)</p>
        )}

        {post.type === 'material' && post.materialUrl && (
          <p>
            <a href={post.materialUrl} target="_blank" rel="noopener noreferrer">
              Download Material
            </a>
          </p>
        )}
      </li>
    ))}
      </ul>
      )}

    </div>
  )

}