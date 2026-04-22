'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import styles from './Classrooms.module.css';
import Navbar from '@/components/navbar/Navbar';
import HomeTab from '@/components/HomeTab/HomeTab';
import PostSection from '@/components/PostSection/PostSection';
import { Home, FileText, ClipboardList, Users } from 'lucide-react'

export default function ClassroomDashboard() {
  const router = useRouter()
  const { id } = useParams()
  const [classroom, setClassroom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [userRole, setUserRole] = useState(null)
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('Home');


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
          // console.log(posts);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }

    }
    fetchClassroom();
  }, [id, router]);

  if (loading) return <div>Loading Classroom...</div>
  if (error) return <div>Error : {error}</div>
  if (!classroom) return <div>Classroom Not Found</div>

  return (<>
    <Navbar />
    {/* <div className={styles.cover}>
    <div className={styles.sideBar}>
          <button onClick={() => setActiveTab("posts")} className={`${styles.tabButton} ${activeTab === "posts" ? styles.activeTab : ''}`}>Posts</button>
          <button onClick={() => setActiveTab("quizzes")} className={`${styles.tabButton} ${activeTab === "quizzes" ? styles.activeTab : ''}`}>Quizzes</button>
          <button onClick={() => setActiveTab("attendance")} className={`${styles.tabButton} ${activeTab === "attendance" ? styles.activeTab : ''}`}>Attendance</button>
    </div>
    <div className={styles.classroomPage}>

      <div className={styles.classroomHeader}>
        <h1>{classroom.name}</h1>
        <p className={styles.joinCode}>
          Join Code: <strong>{classroom.joinCode}</strong>
        </p>
        <span className={`${styles.roleBadge} ${styles[userRole]}`}>
          {userRole === 'teacher' ? 'Teacher Mode' : 'Student Mode'}
        </span>
        {userRole === 'teacher' && (
          <div className={styles.postActions}>
            <button type="button" onClick={() => setShowPostForm(!showPostForm)} className={styles.createPostBtn}>{showPostForm ? 'Cancel' : 'Create New Post'}</button>
            {showPostForm && (
              <form onSubmit={handleCreatePost} className="post-Form">
                <select value={postType} onChange={(e) => setPostType(e.target.value)} className={styles.postTypeSelect}>
                  <option value="announcement">Announcement</option>
                  <option value="material">Material</option>
                  <option value="google_meet">Google Meet Link</option>
                  <option value="quiz">Quiz</option>
                </select>
                <input type="text" placeholder="Post Title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} className={styles.postTitleInput} required />
                <textarea type="text" placeholder="Write Your Post Content Here" value={postContent} onChange={(e) => setPostContent(e.target.value)} rows={5} className={styles.postContentTextarea} required />
                {postType === "google_meet" && (<input type="text" placeholder="Paste Google Meet Link" value={meetLink} onChange={(e) => setMeetLink(e.target.value)} className={styles.meetLinkInput} required />)}
                <div className={styles.attachmentsSection}>
                  <label htmlFor="attachments">Attach PDF's (Optional) Max:5 </label>
                  <input id="attachments" type="file" accept="application/pdf" multiple onChange={(e) => setFiles(Array.from(e.target.files))} className={styles.fileInput} />
                  <ul>
                    {files.map((file, index) => (
                      <li key={index}>{file.name} ({(file.size / 1024).toFixed(1)} KB)</li>
                    ))}
                  </ul>
                </div>

                <button type="submit" className={styles.submitPostBtn}>
                  Publish Post
                </button>
              </form>
            )}

          </div>
        )}
      </div>

      <div className={styles.placeholder}>
        <div className={styles.tabContent}>

          <div className={styles.postsSection}>
            <div className={styles.postsHeader}>
              <h2>Posts & Activities</h2>
              <p className={styles.postsCount}>{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
            </div>

            {posts.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No posts yet.</p>
                {userRole === 'teacher' && <p>Click "Create New Post" to get started.</p>}
              </div>
            ) : (
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <h3>{post.title}</h3>
                      <span className={`${styles.postType} ${styles[post.type] || ''}`}>
                        {post.type.replace('_', ' ')}
                      </span>
                    </div>

                    <p className={styles.postContent}>{post.content}</p>

                    <div className={styles.postMeta}>
                      <span>By {post.author?.username || 'Unknown'}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    {post.attachments && post.attachments.length > 0 && (
                      <div className={styles.postAttachments}>
                        <strong>Attachments:</strong>
                        {post.attachments.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            download
                            className={styles.attachmentLink}
                          >
                            📄 Download PDF {index + 1}
                          </a>
                        ))}
                      </div>
                    )}

                    {post.meetLink && (
                      <div className={styles.meetLinkContainer}>
                        <a
                          href={post.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.meetLink}
                        >
                          🔗 Join Google Meet
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div> */}

    <div className={styles.shell}>

      <div className={styles.sidebar}>
        <button className={activeTab=="Home"?styles.activeTab:styles.tab} onClick={()=>setActiveTab("Home")}><Home size={20} /><span>Home</span></button>
        <button className={activeTab=="Post"?styles.activeTab:styles.tab} onClick={()=>setActiveTab("Post")}> <FileText size={20} /><span>Posts</span></button>
        <button className={activeTab=="Quiz"?styles.activeTab:styles.tab} onClick={()=>setActiveTab("Quiz")}><ClipboardList size={20} /><span>Quizzes</span></button>
        <button className={activeTab=="Attendance"?styles.activeTab:styles.tab} onClick={()=>setActiveTab("Attendance")}> <Users size={20} /><span>Attendance</span></button>
      </div>

      <div className={styles.mainContent}>

      {activeTab==="Home"&&<HomeTab classroom={classroom} userRole={userRole}/>}
      {activeTab==="Post"&&<PostSection posts ={posts} userRole={userRole} />}


      </div>

    </div>

  </>
  )
}