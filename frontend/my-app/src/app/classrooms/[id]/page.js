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
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState('announcement');
  const [files, setFiles] = useState([]);
  const [meetLink,setMeetLink] = useState("");


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

  const handleCreatePost = async (e) => {
    e.preventDefault()
    if (!postTitle.trim() || !postContent.trim()) {
      alert('Add Title and Content for the Post')
    }

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('type', postType);
    formData.append('title', postTitle);
    formData.append('content', postContent);
    if(postType=== 'google_meet'){
      formData.append('meetLink',meetLink);
    }

    if (files.length > 0) {
      files.forEach(file => {
        formData.append('attachments', file);
      })
    }

    try {
      const res = await fetch(`http://localhost:5000/post/${id}/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || 'Failed to create Post');
      }

      alert('Post create Successfully !');
      setPosts([data.post, ...posts]);
      setPostTitle('');
      setPostContent('');
      setPostType('announcement');
      setMeetLink('');
      setFiles([]);
      setShowPostForm(false);
    } catch (err) {
      alert('Error: ' + err.message);
    }
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
                {postType === "google_meet" && (<input type="text" placeholder="Paste Google Meet Link" value={meetLink} onChange={(e)=>setMeetLink(e.target.value)} className={styles.meetLinkInput} required />)}
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


      {/* Placeholder for future content */}
      <div className={styles.placeholder}>
              {/* Posts Section */}
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

                {/* Attachments / Meet Link */}
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
  </>
  )
}