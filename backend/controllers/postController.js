const Post = require('../models/Post');
const User = require('../models/User'); // Certifique-se de importar o modelo UserSocialApp

exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate('author', 'name profileImageUrl')
      .populate({
        path: 'comments.author',
        select: 'name profileImageUrl'
      });

    // Ordenar os comentários de cada post
    posts.forEach(post => {
      post.comments.sort((a, b) => b.createdAt - a.createdAt);
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    res.status(500).json({ message: 'Erro ao buscar publicações' });
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
    const populatedPost = await savedPost.populate('author', 'name profileImageUrl');
    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    res.status(500).json({ message: 'Erro ao criar publicação' });
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
    console.error('Erro ao remover publicação:', error);
    res.status(500).json({ message: 'Erro ao remover publicação' });
  }
};

exports.likePost = async (req, res) => {
  const { id } = req.params;

  try {
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }

    if (!post.likes.includes(req.user.id)) {
      post.likes.push(req.user.id);
    } else {
      post.likes = post.likes.filter(userId => userId.toString() !== req.user.id);
    }

    await post.save();
    post = await Post.findById(id)
      .populate('author', 'name profileImageUrl')
      .populate({
        path: 'comments.author',
        select: 'name profileImageUrl'
      });


    post.comments.sort((a, b) => b.createdAt - a.createdAt);

    res.json(post);
  } catch (error) {
    console.error('Erro ao curtir publicação:', error);
    res.status(500).json({ message: 'Erro ao curtir publicação' });
  }
};

exports.commentPost = async (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  try {
    let post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }

    post.comments.push({ text, author: req.user.id });
    await post.save();
    post = await Post.findById(id)
      .populate('author', 'name profileImageUrl')
      .populate({
        path: 'comments.author',
        select: 'name profileImageUrl'
      });


    post.comments.sort((a, b) => b.createdAt - a.createdAt);

    res.json(post);
  } catch (error) {
    console.error('Erro ao comentar publicação:', error);
    res.status(500).json({ message: 'Erro ao comentar publicação' });
  }
};

exports.deleteComment = async (req, res) => {
  const { postId, commentId } = req.params;

  try {
    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: 'Publicação não encontrada' });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comentário não encontrado' });
    }

    if (comment.author.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Usuário não autorizado' });
    }

    post.comments.pull({ _id: commentId });
    await post.save();
    post = await Post.findById(postId)
      .populate('author', 'name profileImageUrl')
      .populate({
        path: 'comments.author',
        select: 'name profileImageUrl'
      });

    post.comments.sort((a, b) => b.createdAt - a.createdAt);

    res.json(post);
  } catch (error) {
    console.error('Erro ao remover comentário:', error);
    res.status(500).json({ message: 'Erro ao remover comentário' });
  }
};
