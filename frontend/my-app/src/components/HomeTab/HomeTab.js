import styles from "./Home.module.css"
import {useState} from "react";
import CreatePostForm from "../CreatePostForm/CreatePostForm"


export default function HomeTab({classroom,userRole}){
    const [showForm,setShowForm] = useState(false);
    return (<>
        <div className={styles.homeCard}>
            <h1 className={styles.heading}>{classroom.name}</h1>
            <p className={styles.joinCode}>Join Code : <strong>{classroom.joinCode}</strong></p>
            <span className={userRole=="teacher"?styles.badgeTeacher:styles.badgeStudent}>{userRole==="teacher"?'Teacher':'Student'}</span>
            <br />
            {userRole === 'teacher' &&
                <button className={!showForm?styles.postBtn:styles.cancelBtn} onClick={()=>setShowForm(!showForm)}>{showForm ?'Cancel':'Create Post'}</button>
            }
        </div>
        {showForm && <CreatePostForm classroom={classroom} setShowForm={setShowForm}/>}
        </>
    );
}