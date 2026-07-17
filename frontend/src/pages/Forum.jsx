import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { 
  MessageSquare, 
  ThumbsUp, 
  Award, 
  Send, 
  Camera, 
  Loader2, 
  Check, 
  User,
  Plus,
  AlertCircle
} from 'lucide-react';

const Forum = () => {
  const { user } = useAuth();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // New Post Form State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Comments and Expert answer states
  const [activeCommentsPostId, setActiveCommentsPostId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [expertAnswersText, setExpertAnswersText] = useState({});

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/auth';
  const FORUM_API = API_URL.replace('/auth', '/posts');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(FORUM_API);
      if (res.data.success) {
        setPosts(res.data.data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load forum postings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setError('');

    if (!title || !content) {
      setError('Please fill in title and content.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    try {
      setUploading(true);
      const res = await axios.post(FORUM_API, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (res.data.success) {
        setTitle('');
        setContent('');
        setImageFile(null);
        setImagePreview('');
        setIsFormOpen(false);
        fetchPosts();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to publish post.');
    } finally {
      setUploading(false);
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const res = await axios.post(`${FORUM_API}/${postId}/like`);
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === postId) {
              const updatedLikes = res.data.isLiked
                ? [...post.likes, user.id]
                : post.likes.filter((id) => id !== user.id);
              return { ...post, likes: updatedLikes };
            }
            return post;
          })
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId) => {
    if (!commentText.trim()) return;
    try {
      const res = await axios.post(`${FORUM_API}/${postId}/comment`, { text: commentText });
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((post) => {
            if (post._id === postId) {
              return { ...post, comments: res.data.data };
            }
            return post;
          })
        );
        setCommentText('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitExpertAnswer = async (postId) => {
    const answer = expertAnswersText[postId];
    if (!answer || !answer.trim()) return;
    try {
      const res = await axios.post(`${FORUM_API}/${postId}/expert-answer`, { answer });
      if (res.data.success) {
        setPosts((prev) =>
          prev.map((post) => (post._id === postId ? res.data.data : post))
        );
        setExpertAnswersText((prev) => ({ ...prev, [postId]: '' }));
      }
    } catch (err) {
      console.error(err);
      alert('Failed to submit expert answer.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-card">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
            Agronomy Community Forum
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Discuss crop issues, ask agricultural questions, and read verified responses from verified expert agronomists.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-emerald-500 py-3 px-5 text-sm font-semibold text-white hover:brightness-105 active:scale-95 transition"
        >
          <Plus className="h-5 w-5" /> Ask a Question
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-2xl bg-rose-950/30 border border-rose-500/20 p-4 text-sm text-rose-400">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Ask Question Popup Form */}
      {isFormOpen && (
        <div className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-md">
          <h3 className="text-base font-bold text-white mb-4">Post Community Question</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Question Title
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500"
                placeholder="e.g. Yellowing leaf spots on transplant tomatoes"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Provide details / context
              </label>
              <textarea
                rows="4"
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="block w-full rounded-xl border border-white/10 bg-slate-950/50 py-3 px-4 text-sm text-white placeholder-slate-500 outline-none focus:border-primary-500 resize-none"
                placeholder="Describe your plant symptoms, weather, soil type, and watering schedule..."
              />
            </div>

            {/* Image attach uploader */}
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Attach Diagnostic Photo (Optional)
              </label>
              <div className="flex items-center gap-4">
                <label className="flex items-center justify-center gap-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-white/10 py-3 px-4 text-xs font-semibold text-slate-300 cursor-pointer transition">
                  <Camera className="h-4.5 w-4.5" />
                  Attach Image
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden" 
                  />
                </label>
                {imagePreview && (
                  <img src={imagePreview} alt="Attach Preview" className="h-10 w-10 object-cover rounded-lg border border-white/10" />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="rounded-xl border border-white/10 bg-slate-850 py-2.5 px-4 text-xs font-bold text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={uploading}
                className="rounded-xl bg-emerald-500 hover:bg-emerald-600 py-2.5 px-5 text-xs font-bold text-white transition"
              >
                {uploading ? 'Publishing...' : 'Publish Question'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Forum Feeds */}
      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : posts.length > 0 ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <div 
              key={post._id} 
              className="rounded-3xl border border-white/10 bg-slate-900/40 p-6 shadow-xl backdrop-blur-xl space-y-4"
            >
              {/* User meta header */}
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-slate-950/60 border border-white/10 flex items-center justify-center text-slate-400 font-bold">
                  {post.user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {post.user?.name}
                    {post.user?.role === 'expert' && (
                      <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 px-2 py-0.5 text-[8px] font-bold text-emerald-400 uppercase tracking-widest">
                        <Check className="h-2 w-2" /> Expert
                      </span>
                    )}
                  </h4>
                  <span className="text-[10px] text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2">
                <h3 className="text-base font-bold text-white leading-snug">{post.title}</h3>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>

              {/* Attached Image */}
              {post.imageUrl && (
                <div className="rounded-2xl overflow-hidden border border-white/5 bg-slate-950 max-h-72 flex items-center justify-center">
                  <img src={post.imageUrl} alt={post.title} className="w-full object-contain max-h-72" />
                </div>
              )}

              {/* Expert Verified Answer Block */}
              {post.expertAnswer ? (
                <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Award className="h-4.5 w-4.5" /> Expert Verified Resolution
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium">
                    {post.expertAnswer}
                  </p>
                  <span className="text-[9px] text-slate-400 font-bold block pt-1">
                    Answered by: {post.expertAuthor?.name} ({post.expertAuthor?.role})
                  </span>
                </div>
              ) : (user.role === 'expert' || user.role === 'admin') ? (
                /* Expert answer form inputs */
                <div className="p-4 rounded-2xl border border-dashed border-white/10 bg-slate-950/20 space-y-2">
                  <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Expert Verification Panel</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={expertAnswersText[post._id] || ''}
                      onChange={(e) => setExpertAnswersText({ ...expertAnswersText, [post._id]: e.target.value })}
                      placeholder="Add verified agronomist answer/diagnostics..."
                      className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 py-2 px-3 text-xs text-white outline-none"
                    />
                    <button
                      onClick={() => handleSubmitExpertAnswer(post._id)}
                      className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-4 py-2 text-xs font-bold text-white transition"
                    >
                      Verify
                    </button>
                  </div>
                </div>
              ) : null}

              {/* Actions Footer: Likes & Comments Toggle */}
              <div className="flex items-center gap-4 pt-3 border-t border-white/5 text-slate-500 text-xs">
                <button
                  onClick={() => handleToggleLike(post._id)}
                  className={`flex items-center gap-1.5 font-semibold hover:text-white transition ${
                    post.likes.includes(user.id) ? 'text-emerald-400 font-bold' : ''
                  }`}
                >
                  <ThumbsUp className="h-4 w-4" /> {post.likes.length} Likes
                </button>
                
                <button
                  onClick={() => setActiveCommentsPostId(activeCommentsPostId === post._id ? null : post._id)}
                  className="flex items-center gap-1.5 font-semibold hover:text-white transition"
                >
                  <MessageSquare className="h-4 w-4" /> {post.comments.length} Comments
                </button>
              </div>

              {/* Collapsible Comments list */}
              {activeCommentsPostId === post._id && (
                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="space-y-3 pl-4 border-l border-white/5">
                    {post.comments.map((comment, i) => (
                      <div key={i} className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold">
                          <span>{comment.userName}</span>
                          <span>•</span>
                          <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{comment.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Comment input box */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write comment..."
                      className="flex-1 rounded-xl border border-white/10 bg-slate-950/50 py-2 px-3 text-xs text-white placeholder-slate-500 outline-none"
                    />
                    <button
                      onClick={() => handleAddComment(post._id)}
                      className="rounded-xl bg-slate-800 hover:bg-slate-700 p-2 text-white transition flex items-center justify-center"
                    >
                      <Send className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-white/10 rounded-3xl bg-slate-900/10">
          <MessageSquare className="h-12 w-12 text-slate-500 mb-2" />
          <h3 className="text-lg font-bold text-white">No community posts yet</h3>
          <p className="text-sm text-slate-400 max-w-sm mt-1">
            Be the first to ask the AgriSmart expert community a farming or crop system question!
          </p>
        </div>
      )}
    </div>
  );
};

export default Forum;
