import { useState, useEffect } from 'react';
import axios from 'axios';

import './comments.css';

function Comments() {
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState('');
  const [text, setText] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = () => {
    axios
      .get('https://6503495ba0f2c1f3faebbf13.mockapi.io/comment')
      .then((response) => {
        setComments(response.data);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
      });
  };

  const handleDeleteComment = (commentId) => {
    axios
      .delete(`https://6503495ba0f2c1f3faebbf13.mockapi.io/comment/${commentId}`)
      .then(() => {
        fetchComments();
      })
      .catch((error) => {
        console.error('Error deleting comment:', error);
      });
  };

  const handleReply = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setAuthor('');
    setText('');
  };

  const handleCommentSubmit = () => {
    if (author && text) {
      const newComment = {
        author,
        text,
        parentCommentId: replyingTo,
      };

      axios
        .post('https://6503495ba0f2c1f3faebbf13.mockapi.io/comment', newComment)
        .then(() => {
          fetchComments();
          handleCancelReply();
        })
        .catch((error) => {
          console.error('Error posting comment:', error);
        });
    }
  };

  const renderComments = (parentCommentId = null) => {
    return comments
      .filter((comment) => comment.parentCommentId === parentCommentId)
      .map((comment) => (
        <div className={`comment ${comment.parentCommentId ? 'reply' : ''}`} key={comment.id}>
          <strong>{comment.author}</strong>: <p>{comment.text}</p>
          <button onClick={() => handleDeleteComment(comment.id)}>Удалить</button>
          <button onClick={() => handleReply(comment.id)}>Ответить</button>
          {renderComments(comment.id)}
        </div>
      ));
  };

  return (
    <div className="comments-container">
      <h2>Добавить комментарий</h2>
      <div className="comment-form">
        <input
          type="text"
          placeholder="Автор"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <textarea
          placeholder="Текст сообщения"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {replyingTo ? (
          <div>
            <button onClick={handleCommentSubmit}>Отправить ответ</button>
            <button onClick={handleCancelReply}>Отмена</button>
          </div>
        ) : (
          <button onClick={handleCommentSubmit}>Отправить комментарий</button>
        )}
      </div>
      <div className="comment-list">{renderComments()}</div>
    </div>
  );
}

export default Comments;
