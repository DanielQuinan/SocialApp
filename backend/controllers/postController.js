const Post = require('../models/Post');

exports.getPost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id).populate('author', 'name');
    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar publicação' });
  }
};

exports.createPost = async (req, res) => {
  const { title, content, imageUrl } = req.body;

  try {
    const post = new Post({
      title,
      content,
      imageUrl,
      author: req.user.id
    });

    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar publicação' });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate('author', 'name');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar publicações' });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const { title, content, imageUrl } = req.body;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Usuário não autorizado' });
    }

    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar publicação' });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }

    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Usuário não autorizado' });
    }

    await post.deleteOne();
    res.json({ message: 'Publicação removida com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover publicação' });
  }
};
