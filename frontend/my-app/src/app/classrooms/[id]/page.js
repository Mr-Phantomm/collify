"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "./Classrooms.module.css";
import Navbar from "@/components/navbar/Navbar";

export default function ClassroomDashboard() {
  const router = useRouter();
  const { id } = useParams();
  const [classroom, setClassroom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [posts, setPosts] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [showPostForm, setShowPostForm] = useState(false);
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postType, setPostType] = useState("announcement");
  const [files, setFiles] = useState([]);
  const [meetLink, setMeetLink] = useState("");

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [quizQuestionText, setQuizQuestionText] = useState("");
  const [quizOptions, setQuizOptions] = useState(["", "", "", ""]);
  const [quizCorrectIndex, setQuizCorrectIndex] = useState(0);
  const [quizMarks, setQuizMarks] = useState(1);

  const [activeAttempt, setActiveAttempt] = useState(null);
  const [submittedResult, setSubmittedResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    const fetchClassroom = async () => {
      try {
        const res = await fetch(`http://localhost:5000/classroom/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.msg || "ClassRoom not found");
        }
        setClassroom(data.classroom);
        setUserRole(data.role);

        const postsRes = await fetch(`http://localhost:5000/post/${id}/get`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const postsData = await postsRes.json();
        if (postsRes.ok) {
          setPosts(postsData.posts || []);
        }

        const quizRes = await fetch(`http://localhost:5000/quizzes/classroom/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const quizData = await quizRes.json();
        if (quizRes.ok) {
          setQuizzes(quizData.quizzes || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchClassroom();
  }, [id, router]);

  const addQuizQuestion = () => {
    if (!quizQuestionText.trim() || quizOptions.some((opt) => !opt.trim())) {
      alert("Enter full question text and all FOUR option values.");
      return;
    }

    setQuizQuestions([
      ...quizQuestions,
      {
        questionText: quizQuestionText,
        options: quizOptions.map((text, idx) => ({ text, isCorrect: idx === quizCorrectIndex })),
        correctOptionIndex: quizCorrectIndex,
        marks: Number(quizMarks) || 1,
      },
    ]);

    setQuizQuestionText("");
    setQuizOptions(["", "", "", ""]);
    setQuizCorrectIndex(0);
    setQuizMarks(1);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!postTitle.trim() || !postContent.trim()) {
      alert("Add Title and Content for the Post");
      return;
    }

    const token = localStorage.getItem("token");
    let quizId = null;

    if (postType === "quiz") {
      if (quizQuestions.length === 0) {
        alert("Add at least one question before creating a quiz.");
        return;
      }

      const quizRes = await fetch(`http://localhost:5000/quizzes/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: postTitle,
          description: postContent,
          classroomId: id,
          timeLimitMinutes: 30,
        }),
      });

      const quizData = await quizRes.json();
      if (!quizRes.ok) {
        throw new Error(quizData.msg || "Failed to create quiz");
      }

      quizId = quizData.quiz.id;

      for (const question of quizQuestions) {
        await fetch(`http://localhost:5000/quizzes/${quizId}/add-question`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionText: question.questionText,
            options: question.options,
            correctOptionIndex: question.correctOptionIndex,
            marks: question.marks,
          }),
        });
      }
    }

    const formData = new FormData();
    formData.append("type", postType);
    formData.append("title", postTitle);
    formData.append("content", postContent);

    if (postType === "google_meet") {
      formData.append("meetLink", meetLink);
    }
    if (postType === "quiz") {
      formData.append("quiz_id", quizId);
    }
    if (postType === "material" && postContent.trim()) {
      formData.append("material_URL", postContent);
    }

    if (files.length > 0) {
      files.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      const res = await fetch(`http://localhost:5000/post/${id}/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.msg || "Failed to create Post");
      }

      alert("Post create Successfully !");

      if (postType === "quiz") {
        const moreQuizzesRes = await fetch(`http://localhost:5000/quizzes/classroom/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const moreQuizData = await moreQuizzesRes.json();
        if (moreQuizzesRes.ok) setQuizzes(moreQuizData.quizzes || []);
        setQuizQuestions([]);
      }

      setPosts([data.post, ...posts]);
      setPostTitle("");
      setPostContent("");
      setPostType("announcement");
      setMeetLink("");
      setFiles([]);
      setShowPostForm(false);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const startQuiz = async (quizId) => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:5000/attempts/${quizId}/start`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Unable to start quiz");
      }
      setActiveAttempt({ ...data, quizId, answers: {} });
      setSubmittedResult(null);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const selectAnswer = (questionId, optionIndex) => {
    if (!activeAttempt) return;
    setActiveAttempt((prev) => ({
      ...prev,
      answers: {
        ...prev.answers,
        [questionId]: optionIndex,
      },
    }));
  };

  const submitQuizAttempt = async () => {
    if (!activeAttempt) return;

    const token = localStorage.getItem("token");

    const answers = (activeAttempt.questions || []).map((q) => ({
      question: q._id,
      selectedOptionIndex: Number(activeAttempt.answers[q._id] ?? -1),
    }));

    try {
      const res = await fetch(`http://localhost:5000/attempts/${activeAttempt.attemptId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ answers }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.msg || "Failed to submit quiz");
      }
      setSubmittedResult({ score: data.score, totalMarks: data.totalMarks });
      setActiveAttempt(null);
      alert(`Quiz submitted! score: ${data.score}/${data.totalMarks}`);
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  if (loading) return <div>Loading Classroom...</div>;
  if (error) return <div>Error : {error}</div>;
  if (!classroom) return <div>Classroom Not Found</div>;

  return (
    <>
      <Navbar />
      <div className={styles.classroomPage}>
        {/* Header */}
        <div className={styles.classroomHeader}>
          <h1>{classroom.name}</h1>
          <p className={styles.joinCode}>
            Join Code: <strong>{classroom.joinCode}</strong>
          </p>
          <span className={`${styles.roleBadge} ${styles[userRole]}`}>
            {userRole === "teacher" ? "Teacher Mode" : "Student Mode"}
          </span>
          {userRole === "teacher" && (
            <div className={styles.postActions}>
              <button
                type="button"
                onClick={() => setShowPostForm(!showPostForm)}
                className={styles.createPostBtn}
              >
                {showPostForm ? "Cancel" : "Create New Post"}
              </button>
              {showPostForm && (
                <form onSubmit={handleCreatePost} className="post-Form">
                  <select
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    className={styles.postTypeSelect}
                  >
                    <option value="announcement">Announcement</option>
                    <option value="material">Material</option>
                    <option value="google_meet">Google Meet Link</option>
                    <option value="quiz">Quiz</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Post Title"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    className={styles.postTitleInput}
                    required
                  />
                  <textarea
                    type="text"
                    placeholder="Write Your Post Content Here"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    rows={5}
                    className={styles.postContentTextarea}
                    required
                  />
                  {postType === "google_meet" && (
                    <input
                      type="text"
                      placeholder="Paste Google Meet Link"
                      value={meetLink}
                      onChange={(e) => setMeetLink(e.target.value)}
                      className={styles.meetLinkInput}
                      required
                    />
                  )}

                  {postType === "quiz" && (
                    <div className={styles.quizBuilder}>
                      <h4>Quiz Question Builder</h4>

                      <input
                        value={quizQuestionText}
                        placeholder="Question text"
                        onChange={(e) => setQuizQuestionText(e.target.value)}
                        className={styles.quizInput}
                      />

                      {quizOptions.map((opt, idx) => (
                        <div key={idx} className={styles.quizOptionRow}>
                          <input
                            type="radio"
                            name="correctOption"
                            checked={quizCorrectIndex === idx}
                            onChange={() => setQuizCorrectIndex(idx)}
                          />
                          <input
                            value={opt}
                            placeholder={`Option ${idx + 1}`}
                            onChange={(e) => {
                              const newOpts = [...quizOptions];
                              newOpts[idx] = e.target.value;
                              setQuizOptions(newOpts);
                            }}
                            className={styles.quizInput}
                          />
                        </div>
                      ))}

                      <div>
                        <label>Marks:</label>
                        <input
                          type="number"
                          min="1"
                          value={quizMarks}
                          onChange={(e) => setQuizMarks(e.target.value)}
                          className={styles.quizSizeInput}
                        />
                      </div>

                      <button type="button" onClick={addQuizQuestion} className={styles.addQuestionBtn}>
                        Add Question to Quiz
                      </button>

                      {quizQuestions.length > 0 && (
                        <ul className={styles.quizQuestionList}>
                          {quizQuestions.map((q, idx) => (
                            <li key={idx}>
                              {idx + 1}. {q.questionText} ({q.marks} pts)
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}

                  <div className={styles.attachmentsSection}>
                    <label htmlFor="attachments">
                      Attach PDF's (Optional) Max:5{" "}
                    </label>
                    <input
                      id="attachments"
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={(e) => setFiles(Array.from(e.target.files))}
                      className={styles.fileInput}
                    />
                    <ul>
                      {files.map((file, index) => (
                        <li key={index}>
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </li>
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

        {/* Quiz / Assessment Section */}
        <div className={styles.quizSection}>
          <h2>Quizzes and Assessments</h2>
          {quizzes.length === 0 ? (
            <p>No quizzes created yet.</p>
          ) : (
            <ul className={styles.quizList}>
              {quizzes.map((quiz) => (
                <li key={quiz._id} className={styles.quizCard}>
                  <h3>{quiz.title}</h3>
                  <p>{quiz.description || "No description"}</p>
                  <p>Questions: {quiz.questions?.length || 0}</p>
                  <p>Total Marks: {quiz.totalMarks}</p>
                  {userRole === "student" ? (
                    <button
                      onClick={() => startQuiz(quiz._id)}
                      className={styles.takeQuizBtn}
                    >
                      Start Quiz
                    </button>
                  ) : (
                    <span className={styles.teacherQuizLabel}>Teacher quiz</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {activeAttempt && (
          <div className={styles.activeQuizContainer}>
            <h3>Attempt: {activeAttempt.quizTitle}</h3>
            <p>Time Limit: {activeAttempt.timeLimitMinutes} minutes</p>
            <form>
              {activeAttempt.questions.map((question, index) => (
                <div key={question._id} className={styles.questionBlock}>
                  <p>
                    {index + 1}. {question.questionText}
                  </p>
                  {question.option.map((option, idx) => (
                    <label key={idx} className={styles.optionLabel}>
                      <input
                        type="radio"
                        name={`q-${question._id}`}
                        checked={activeAttempt.answers[question._id] === idx}
                        onChange={() => selectAnswer(question._id, idx)}
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              ))}
              <button type="button" onClick={submitQuizAttempt} className={styles.submitQuizBtn}>
                Submit Quiz
              </button>
            </form>
          </div>
        )}

        {submittedResult && (
          <div className={styles.quizResult}>
            <h3>Quiz Result</h3>
            <p>
              Score: {submittedResult.score} / {submittedResult.totalMarks}
            </p>
          </div>
        )}

        {/* Placeholder for future content */}
        <div className={styles.placeholder}>
          {/* Posts Section */}
          <div className={styles.postsSection}>
            <div className={styles.postsHeader}>
              <h2>Posts & Activities</h2>
              <p className={styles.postsCount}>
                {posts.length} post{posts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {posts.length === 0 ? (
              <div className={styles.noPosts}>
                <p>No posts yet.</p>
                {userRole === "teacher" && (
                  <p>Click "Create New Post" to get started.</p>
                )}
              </div>
            ) : (
              <div className={styles.postsList}>
                {posts.map((post) => (
                  <div key={post._id} className={styles.postCard}>
                    <div className={styles.postHeader}>
                      <h3>{post.title}</h3>
                      <span
                        className={`${styles.postType} ${styles[post.type] || ""}`}
                      >
                        {post.type.replace("_", " ")}
                      </span>
                    </div>

                    <p className={styles.postContent}>{post.content}</p>

                    <div className={styles.postMeta}>
                      <span>By {post.author?.username || "Unknown"}</span>
                      <span>
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
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
  );
}