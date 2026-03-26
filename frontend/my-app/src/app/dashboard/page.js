'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './Dashboard.module.css'
import Navbar from '@/components/navbar/Navbar'
import ClassRoomCard from '@/components/classroom-card/ClassRoomCard'

export default function DashBoard() {
    const router = useRouter()
    const [classrooms, setClassrooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [role, setRole] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [classroomName, setClassroomName] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

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

    const handleCreateClassroom = async (e) => {
        e.preventDefault();

        if (!classroomName.trim()) {
            alert("Enter a valid ClassRoom Name");
            return;
        }
        const token = localStorage.getItem("token");
        try {
            const response = await fetch("http://localhost:5000/classroom/create", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: classroomName })
            });
            const data = await response.json();
            console.log(data);
            if (!response.ok) {
                throw new Error(data.msg || 'Failed to Create ClassRoom');
            }
            alert("ClassRoom Created! Join Code: " + data.classroom.joinCode);
            setClassrooms([data.classroom, ...classrooms]);
            setClassroomName('');
            setShowCreateForm(false);
        } catch (err) {
            alert('Error:', err.message);
        }
    }

    const handleJoinClassroom = async (e) => {
        e.preventDefault();

        if (!joinCode.trim()) {
            alert("Add A Valid Join Code");
            return;
        }

        const token = localStorage.getItem("token");

        try {
            const response = await fetch("http://localhost:5000/classroom/join", {
                method: "POST",
                headers: {
                    'Content-Type': "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ joinCode }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.msg.trim() || "Failed to join classroom ");
            }
            console.log(data);
            alert('Joined Successfully!')
            setClassrooms([data.classroom, ...classrooms]);
            setJoinCode('');

        } catch (err) {
            alert("Error :", err.message);
        }

    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        router.push('/login');
    }



    if (loading) {
        return <div> Loading Your Classrooms ...</div>
    }
    if (error) {
        return <div> Error: {error} </div>
    }

    return (
        <>
        <Navbar />
        <div className={styles.container}>
        {/* Header */}
        <header className={styles.header}>
          <p className={styles.subtitle}>
            Welcome back, {role === 'teacher' ? 'Professor' : 'Student'}. Manage your learning environments.
          </p>
        </header>

        {/* Action Options */}
        <div className={styles.actionsGrid}>
          {/* Action 1: My Classrooms Scroll-to Section */}
          <div className={styles.actionCard} onClick={() => document.getElementById('classrooms-section').scrollIntoView({ behavior: 'smooth' })}>
            <div className={styles.cardContent}>
              <h2>My Classrooms</h2>
              <p>View your {classrooms.length} active learning groups.</p>
            </div>
            <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </div>

          {/* Action 2: Role Based Action (Create or Join) */}
          <div className={`${styles.actionCard} ${styles.createCard}`} onClick={() => role === 'teacher' ? setShowCreateForm(!showCreateForm) : null}>
            <div className={styles.cardContent}>
              <h2>{role === 'teacher' ? (showCreateForm ? 'Close Form' : 'Create New') : 'Join Classroom'}</h2>
              
              {/* Conditional Form Rendering inside Action Card */}
              {(role === 'teacher' && showCreateForm) && (
                <form onSubmit={handleCreateClassroom} className={styles.inlineForm} onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="text" 
                    placeholder="ClassRoom Name" 
                    value={classroomName} 
                    onChange={(e) => setClassroomName(e.target.value)} 
                    className={styles.formInput}
                  />
                  <button type="submit" className={styles.formButton}>Create</button>
                </form>
              )}

              {role === 'student' && (
                <form onSubmit={handleJoinClassroom} className={styles.inlineForm} onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="text" 
                    placeholder="6-Digit Join Code" 
                    value={joinCode} 
                    onChange={(e) => setJoinCode(e.target.value)} 
                    className={styles.formInput}
                  />
                  <button type="submit" className={styles.formButton}>Join</button>
                </form>
              )}
              
              {!showCreateForm && role === 'teacher' && <p>Launch a new interactive classroom.</p>}
              {role === 'student' && <p>Enter a code to participate in a class.</p>}
            </div>
            {role === 'teacher' && !showCreateForm && <svg className={styles.arrowIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
          </div>
        </div>

        {/* Classrooms List Grid */}
        <section id="classrooms-section">
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Active Environments</h3>
          </div>

          <div className={styles.classroomGrid}>
            {classrooms.length === 0 ? (
              <div className={styles.emptyState}>
                <p className={styles.noClassrooms}>
                  No Classrooms yet. {role === 'teacher' && "Create one to get started!"}
                </p>
              </div>
            ) : (
              classrooms.map((classroom) => (
                <ClassRoomCard key={classroom._id} classroom={classroom} />
              ))
            )}
            
            {role === 'teacher' && (
              <div className={styles.addPlaceholder} onClick={() => setShowCreateForm(true)}>
                <div className={styles.addText}>
                  <svg className={styles.addIcon} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Classroom</span>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
        </>
    );
}