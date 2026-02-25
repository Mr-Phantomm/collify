'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashBoard() {
    const router = useRouter()
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role,setRole] = useState('') ;
    const [joinCode, setJoinCode] = useState('');
    const [classroomName,setClassroomName] = useState('');
    const [showCreateForm,setShowCreateForm] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        }
        const fetchMyClassrooms = async () => {
            try {
                const response = await fetch('http://localhost:5000/classroom/get', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.msg || "Failed to load classrooms ");
                }
                setClassrooms(data.classroom || []);
                setRole(data.role)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
                // console.log(classrooms);
            }
        }
        fetchMyClassrooms();
    }, [router]);

    const handleCreateClassroom=async (e)=>{
        e.preventDefault();

        if(!classroomName.trim()){
            alert("Enter a valid ClassRoom Name");
            return;
        }
        const token=localStorage.getItem("token");
        try{
            const response = await fetch("http://localhost:5000/classroom/create",{
                method:"POST",
                headers:{
                    'Content-Type':'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body : JSON.stringify({name:classroomName})
            });
            const data=await response.json();
            console.log(data);
            if(!response.ok){
                throw new Error(data.msg || 'Failed to Create ClassRoom');
            }
            alert("ClassRoom Created! Join Code: "+data.classroom.joinCode );
            setClassrooms([data.classroom,...classrooms]);
            setClassroomName('');
            setShowCreateForm(false);
        }catch(err){
            alert('Error:',err.message);
        }
    }

    const handleJoinClassroom = async (e)=>{
        e.preventDefault();
        
        if(!joinCode.trim()){
            alert("Add A Valid Join Code");
            return;
        }

        const token = localStorage.getItem("token");

        try{
            const response = await fetch("http://localhost:5000/classroom/join",{
                method: "POST",
                headers: {
                    'Content-Type':"application/json",
                    "Authorization":`Bearer ${token}`
                },
                body:JSON.stringify({joinCode}),
            });

            const data = await response.json();
            if(!response.ok){
                throw new Error(data.msg.trim() || "Failed to join classroom ");
            }
            console.log(data);
            alert('Joined Successfully!')
            setClassrooms([data.classroom,...classrooms]);
            setJoinCode('');

        }catch(err){
            alert("Error :",err.message);
        }
    
    }

    const handleLogout=()=>{
        localStorage.removeItem("token");
        router.push('/login');
    }



    if(loading){
        return <div> Loading Your Classrooms ...</div>
    }
    if(error){
        return <div> Error: {error} </div>
    }

    return (
        <div>
            <h1>DashBoard</h1>

            <button onClick={handleLogout}>Logout</button>

            <h2>My Classrooms</h2>

            {role === 'teacher' && (
                <div>
                    <button onClick={()=>setShowCreateForm(!showCreateForm)}>
                        {showCreateForm?'Cancel':'Create new Classroom'}
                    </button>
                    {showCreateForm && (
                        <form onSubmit={handleCreateClassroom}>
                            <input type="text" placeholder="ClassRoom Name" value={classroomName} onChange={(e)=>setClassroomName(e.target.value)} />
                            <button type="submit">Create</button>
                        </form>
                    )}
                </div>   
            )}

            {role === 'student' && (
               <div>
                <form onSubmit={handleJoinClassroom}>
                <input type="text" placeholder="Enter Join Code (6 Digits)" value={joinCode} onChange={(e)=>setJoinCode(e.target.value)} />
                <button type="submit">Join</button>

                </form>

               </div> 
            )}

            {classrooms.length === 0 ?(
                <p>No Classrooms yet.{role === 'teacher' &&"Create one if you are a Teacher"}</p>
            ):<ul>
                {classrooms.map((classroom)=>(
                    <li key={classroom._id} style={{cursor:"pointer"}} onClick = {()=> router.push(`/classrooms/${classroom._id}`)}>
                        {classroom.name}
                        <br />
                        Join Code: <strong>{classroom.joinCode}</strong>
                    </li>
                ))}
                </ul>
                }


        </div>
    );
}