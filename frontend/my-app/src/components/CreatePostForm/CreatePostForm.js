import { useState } from "react";
import styles from "./PostForm.module.css";
export default function CreateForm({classroom,setShowForm}){

    const [postType,setPostType] = useState('announcement');
    const [title,setTitle] = useState('');
    const [content,setContent] = useState('');
    const [meetLink,setMeetLink] = useState("");
    const [files,setFiles ] = useState([]);

    const handleCreatePost = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
          alert('Add Title and Content for the Post')
        }
    
        const token = localStorage.getItem('token');
        const formData = new FormData();
        formData.append('type', postType);
        formData.append('title', title);
        formData.append('content', content);
        if (postType === 'google_meet') {
          formData.append('meetLink', meetLink);
        }
    
        if (files.length > 0) {
          files.forEach(file => {
            formData.append('attachments', file);
          })
        }
    
        try {
          const res = await fetch(`http://localhost:5000/post/${classroom._id}/create`, {
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
          setTitle('');
          setContent('');
          setPostType('announcement');
          setMeetLink('');
          setFiles([]);
          setShowForm(false);
        } catch (err) {
          alert('Error: ' + err.message);
        }
      }

    return (
       <div>
        <form className={styles.formWrapper} onSubmit={handleCreatePost}>
            <select className={styles.postType} value={postType} onChange={(e)=>setPostType(e.target.value)}>
                <option value="announcement">Announcements</option>
                <option value="googleMeet">Google Meet</option>
                <option value="material">Material</option>
            </select>
            <input className={styles.postText} type="text" value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Post Title"/>
            <textarea className={styles.postContent} value={content} onChange={(e)=>setContent(e.target.value)} placeholder="Content"/>
            {postType === 'googleMeet' && (
                <input type="text" className={styles.postText} placeholder="Paste Google Meet Link" value={meetLink} onChange={(e)=>setMeetLink(e.target.value)} />
            )}
            {postType === "material" && (
                <input type="file" accept="application/pdf" className={styles.postFiles} multiple onChange={(e)=>setFiles(Array.from(e.target.files))} />
            )}
            <button className={styles.createPost}>Create Post</button>
        </form>
       </div> 
    );
}