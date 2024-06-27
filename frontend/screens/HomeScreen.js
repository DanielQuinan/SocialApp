import React, { useState, useEffect, useContext } from 'react';
import { View, Text, Image, StyleSheet, FlatList, TouchableOpacity, TextInput } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getPosts, deletePost, likePost, commentPost, deleteComment } from '../services/post';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const isFocused = useIsFocused();

  const fetchPosts = async () => {
    try {
      const postsData = await getPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Erro ao buscar publicações', error);
    }
  };

  useEffect(() => {
    if (isFocused) {
      fetchPosts();
    }
  }, [isFocused]);

  const handleDelete = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await deletePost(id, token);
      setPosts(posts.filter(post => post._id !== id));
    } catch (error) {
      console.error('Erro ao excluir publicação', error);
    }
  };

  const handleLike = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedPost = await likePost(id, token);
      setPosts(posts.map(post => post._id === id ? updatedPost : post));
    } catch (error) {
      console.error('Erro ao curtir publicação', error);
    }
  };

  const handleComment = async (id) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedPost = await commentPost(id, { text: commentText }, token);
      setPosts(posts.map(post => post._id === id ? updatedPost : post));
      setCommentText('');
    } catch (error) {
      console.error('Erro ao comentar publicação', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const updatedPost = await deleteComment(postId, commentId, token);
      setPosts(posts.map(post => post._id === postId ? updatedPost : post));
    } catch (error) {
      console.error('Erro ao excluir comentário', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.post}>
      <View style={styles.postHeader}>
        <Image source={{ uri: item.author.profileImageUrl }} style={styles.profileImage} />
        <Text style={styles.authorName}>{item.author.name}</Text>
        {user._id === item.author._id && (
          <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.deleteButton}>
            <Image source={require('../assets/bin.png')} style={styles.icon} />
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.postTitle}>{item.title}</Text>
      <Text>{item.content}</Text>
      {item.imageUrl && (
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.postImage}
        />
      )}
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => handleLike(item._id)}>
          <Image source={require('../assets/like.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text>{item.likes.length}</Text>
      </View>
      <FlatList
        data={item.comments}
        renderItem={({ item: comment }) => (
          <View style={styles.comment}>
            <Image source={{ uri: comment.author.profileImageUrl }} style={styles.profileImage} />
            <View>
              <Text style={styles.commentText}>{comment.text}</Text>
              <Text style={styles.commentAuthor}>- {comment.author.name}</Text>
            </View>
            {user._id === comment.author._id && (
              <TouchableOpacity onPress={() => handleDeleteComment(item._id, comment._id)}>
                <Image source={require('../assets/bin.png')} style={styles.icon} />
              </TouchableOpacity>
            )}
          </View>
        )}
        keyExtractor={(comment) => comment._id.toString()}
      />
      <TextInput
        style={styles.input}
        value={commentText}
        onChangeText={setCommentText}
        placeholder="Comente..."
      />
      <TouchableOpacity onPress={() => handleComment(item._id)} style={styles.commentButton}>
        <Text style={styles.commentButtonText}>Comentar</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item._id.toString()}
        style={styles.postList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  postList: {
    marginTop: 16,
  },
  post: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  authorName: {
    fontSize: 16,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteButton: {
    position: 'absolute',
    right: 0,
    top: 0,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginTop: 16,
    borderRadius: 8,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  comment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  commentText: {
    fontSize: 14,
  },
  commentAuthor: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#555',
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 16,
  },
  commentButton: {
    marginTop: 8,
    backgroundColor: '#0070f3',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
