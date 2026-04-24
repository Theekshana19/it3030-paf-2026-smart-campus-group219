import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as commentsApi from '../api/commentsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import { useAuth } from '../../auth/hooks/useAuth.js';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';

export default function TicketCommentsCard({ ticketId }) {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [posting, setPosting] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const loadComments = useCallback(async () => {
    try {
      const data = await commentsApi.listComments(ticketId);
      setComments(Array.isArray(data) ? data : []);
    } catch {
      setComments([]);
    }
  }, [ticketId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  useEffect(() => {
    if (!user?.email) return;
    setAuthorEmail((prev) => (prev.trim() ? prev : user.email));
    setAuthorName((prev) => (prev.trim() ? prev : (user.displayName ?? '').trim() || prev));
  }, [user?.email, user?.displayName]);

  const handlePost = async () => {
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) {
      toast.error('Please fill in your name, email, and comment');
      return;
    }
    setPosting(true);
    try {
      await commentsApi.addComment(ticketId, {
        authorEmail: authorEmail.trim(),
        authorName: authorName.trim(),
        commentText: newComment.trim(),
      });
      setNewComment('');
      toast.success('Comment added');
      loadComments();
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      setPosting(false);
    }
  };

  const startEdit = (comment) => {
    setEditingId(comment.commentId);
    setEditText(comment.commentText);
    setEditEmail('');
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }
    if (!editEmail.trim()) {
      toast.error('Enter your email to confirm ownership');
      return;
    }
    try {
      await commentsApi.updateComment(ticketId, commentId, editEmail.trim(), editText.trim());
      toast.success('Comment updated');
      setEditingId(null);
      loadComments();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  const handleDelete = async (commentId) => {
    const email = window.prompt('Enter your email to delete this comment:');
    if (!email) return;
    try {
      await commentsApi.deleteComment(ticketId, commentId, email.trim());
      toast.success('Comment deleted');
      loadComments();
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  };

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="chat" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Comments ({comments.length})</h3>
      </div>

      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-on-surface-variant font-body">No comments yet. Be the first to comment.</p>
        )}
        {comments.map((c) => (
          <div key={c.commentId} className="p-4 bg-surface-container-low rounded-lg">
            {editingId === c.commentId ? (
              <div className="space-y-2">
                <textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  rows={2}
                  className={inputClass}
                />
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="Your email to confirm"
                  className={inputClass}
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdate(c.commentId)}
                    className="flex items-center gap-1 bg-primary-container text-on-primary px-3 py-1.5 rounded-lg text-xs font-bold font-manrope hover:opacity-90"
                  >
                    <Icon name="save" className="text-sm" /> Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold font-manrope text-on-surface-variant hover:bg-surface-container-high"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-on-surface">{c.authorName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-on-surface-variant">
                      {c.createdAt?.replace('T', ' ').slice(0, 16)}
                      {c.isEdited && <span className="ml-1 italic">(edited)</span>}
                    </span>
                    <button
                      type="button"
                      onClick={() => startEdit(c)}
                      className="text-on-surface-variant/50 hover:text-primary transition-colors"
                      title="Edit comment"
                    >
                      <Icon name="edit" className="text-sm" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.commentId)}
                      className="text-on-surface-variant/50 hover:text-error transition-colors"
                      title="Delete comment"
                    >
                      <Icon name="delete" className="text-sm" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-on-surface font-body">{c.commentText}</p>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-surface-container-high pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Your name"
            className={inputClass}
          />
          <input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Your email"
            className={inputClass}
          />
        </div>
        <div className="flex gap-3">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            rows={2}
            className={`flex-1 ${inputClass}`}
          />
          <button
            type="button"
            disabled={posting}
            onClick={handlePost}
            className="self-end flex items-center gap-1 bg-primary-container text-on-primary px-4 py-2.5 rounded-lg font-bold text-sm font-manrope hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Icon name="send" className="text-base" />
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
