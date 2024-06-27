import { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import { createPost } from '../services/post';
import AuthContext from '../context/AuthContext';

export default function CreatePost() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await createPost({ title, content, imageUrl }, token);
      router.push('/');
    } catch (error) {
      console.error('Erro ao criar publicação', error);
    }
  };

  return (
    <div className="container">
      <h1>Criar Publicação</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)} 
          placeholder="Título" 
          required 
        />
        <textarea 
          value={content} 
          onChange={(e) => setContent(e.target.value)} 
          placeholder="Conteúdo" 
          required 
        />
        <input 
          type="text" 
          value={imageUrl} 
          onChange={(e) => setImageUrl(e.target.value)} 
          placeholder="URL da Imagem" 
        />
        <button type="submit">Criar Publicação</button>
      </form>
      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          background: #fff;
          border-radius: 5px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        form {
          display: flex;
          flex-direction: column;
        }
        input, textarea, button {
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
}