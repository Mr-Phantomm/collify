import styles from "./PostSection.module.css"

export default function PostSection({ posts, userRole }) {
  return (
    <div className={styles.postsWrapper}>
      {posts.length === 0 ? (
        <div className={styles.noPosts}>
          <p>No posts yet.</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post._id} className={styles.postCard}>
            
            <div className={styles.postHeader}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <span className={`${styles.typeBadge} ${styles[post.type]}`}>
                {post.type.replace('_', ' ')}
              </span>
            </div>

            <p className={styles.postContent}>{post.content}</p>

            <div className={styles.postMeta}>
              <span>By {post.author?.username || 'Unknown'}</span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>

            {post.meetLink && (
              <a href={post.meetLink} target="_blank" rel="noopener noreferrer" className={styles.meetLink}>
                🔗 Join Google Meet
              </a>
            )}

            {post.attachments?.length > 0 && (
              <div className={styles.attachments}>
                {post.attachments.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className={styles.attachmentLink}>
                    📄 File {i + 1}
                  </a>
                ))}
              </div>
            )}

          </div>
        ))
      )}
    </div>
  )
}