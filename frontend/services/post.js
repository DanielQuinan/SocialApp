import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.0.107:5000/api/posts/';

export const createPost = async (post, token) => {
  const response = await axios.post(API_URL, post, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const getPosts = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const deletePost = async (id, token) => {
  const response = await axios.delete(`${API_URL}${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const likePost = async (id, token) => {
  const response = await axios.post(`${API_URL}${id}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const commentPost = async (id, comment, token) => {
  const response = await axios.post(`${API_URL}${id}/comment`, comment, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};

export const deleteComment = async (postId, commentId, token) => {
  const response = await axios.delete(`${API_URL}${postId}/comment/${commentId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
