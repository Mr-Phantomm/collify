import styles from "./PostSection.module.css"
export default function PostSection({ posts,userRole }){
    return (
        <div className={styles.postWrapper}>
            {posts.map((post) => (
                <div key ={post._id} className={styles.postCard}> 
                    <div className={styles.postHeader}>
                        <h3>{post.title}</h3>
                        <span className={styles.typeBadge}>{post.type}</span>
                    </div>

                    <p>{post.content}</p>

                    <div className={styles.postMeta}>
                        <span>By {post.author.username}</span>
                        <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>

                    {post.meetLink && (
                        <a href={post.meetLink} target="_blank">Join Google Meet </a>
                    )}

                    {post.attachments?.length>0 && (
                        post.attachments.map((url,i)=>(
                            <a key={i} href={url} target="_blank" rel="noopener noreferrer">File {i+1}</a>
                        ))
                    )}

                </div>
            ))}

        </div>
    );
}