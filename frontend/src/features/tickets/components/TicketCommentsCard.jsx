import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import * as commentsApi from '../api/commentsApi.js';
import { getErrorMessage } from '../../../services/httpClient.js';
import Icon from '../../../components/common/Icon.jsx';

const inputClass = 'w-full bg-surface-container-low border-none rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all font-body outline-none';

// this component shows the comments section on the ticket details page
// users can add new comments and see all existing comments
export default function TicketCommentsCard({ ticketId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [posting, setPosting] = useState(false);

  // load all comments for this ticket from the API
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

  // submit a new comment to the ticket
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

  return (
    <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-8 h-8 rounded-lg bg-secondary-container flex items-center justify-center text-secondary">
          <Icon name="chat" className="text-xl" />
        </span>
        <h3 className="text-lg font-bold font-manrope">Comments ({comments.length})</h3>
      </div>

      {/* list of existing comments */}
      <div className="space-y-4 mb-6">
        {comments.length === 0 && (
          <p className="text-sm text-on-surface-variant font-body">No comments yet. Be the first to comment.</p>
        )}
        {comments.map((c) => (
          <div key={c.commentId} className="p-4 bg-surface-container-low rounded-lg">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium text-on-surface">{c.authorName}</span>
              <span className="text-xs text-on-surface-variant">
                {c.createdAt?.replace('T', ' ').slice(0, 16)}
                {c.isEdited && <span className="ml-1 italic">(edited)</span>}
              </span>
            </div>
            <p className="text-sm text-on-surface font-body">{c.commentText}</p>
          </div>
        ))}
      </div>

      {/* add new comment form */}
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
