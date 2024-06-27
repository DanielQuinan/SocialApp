import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import { getPosts, deletePost, likePost, commentPost, deleteComment } from '../services/post';
import AuthContext from '../context/AuthContext';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const { user, updateUser } = useContext(AuthContext);
  const router = useRouter();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (error) {
        console.error('Erro ao buscar publicações', error);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await deletePost(id, token);
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Erro ao excluir publicação', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = await likePost(id, token);
      setPosts(posts.map(post => post._id === id ? updatedPost : post));
    } catch (error) {
      console.error('Erro ao curtir publicação', error);
    }
  };

  const handleComment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = await commentPost(id, { text: commentText }, token);
      setPosts(posts.map(post => post._id === id ? updatedPost : post));
      setCommentText("");
    } catch (error) {
      console.error('Erro ao comentar publicação', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedPost = await deleteComment(postId, commentId, token);
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Erro ao excluir comentário', error);
    }
  };

  return (
    <div className="container">
      <h1>Publicações</h1>
      {posts.length > 0 ? (
        <ul>
          {posts.map((post) => (
            <li key={post._id}>
              <div className="card">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                {post.imageUrl && <img src={post.imageUrl} alt={post.title} />}
                <p>Autor: {post.author.name}</p>
                <button onClick={() => handleLike(post._id)}>
                  {post.likes.includes(user?._id) ? 'Descurtir' : 'Curtir'} ({post.likes.length})
                </button>
                <div>
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Comente..."
                  />
                  <button onClick={() => handleComment(post._id)}>Comentar</button>
                </div>
                <ul>
                  {post.comments.map((comment) => (
                    <li key={comment._id}>
                      <p>{comment.text} - {comment.author.name}</p>
                      {comment.author._id === user?._id && (
                        <button onClick={() => handleDeleteComment(post._id, comment._id)}>Excluir</button>
                      )}
                    </li>
                  ))}
                </ul>
                {(user && post.author._id === user._id) && (
                  <button onClick={() => handleDelete(post._id)}>Excluir</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>Nenhuma publicação encontrada</p>
      )}
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
        }
        ul {
          list-style: none;
          padding: 0;
        }
        li {
          margin-bottom: 1rem;
        }
        .card {
          border: 1px solid #ccc;
          padding: 1rem;
          border-radius: 5px;
        }
        h2 {
          margin-top: 0;
        }
        button {
          margin-right: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          background-color: #0070f3;
          color: white;
          transition: background-color 0.3s;
        }
        button:hover {
          background-color: #005bb5;
        }
        img {
          max-width: 100%;
          height: auto;
        }
        input {
          margin-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}
