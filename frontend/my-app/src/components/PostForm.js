import React, { useState } from 'react';

function PostForm({ post, onSubmit }) {
  const [title, setTitle] = useState(post ? post.title : '');
  const [description, setDescription] = useState(post ? post.description : '');
  const [images, setImages] = useState(post ? post.images : '');
  const [videoLink, setVideoLink] = useState(post ? post.videoLink : '');
  const [tags, setTags] = useState(post ? post.tags : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, description, images, videoLink, tags });
  };

  return (
    <div className="post-form-container">
      <h2 className="form-title">Create/Update Post</h2>
      <form onSubmit={handleSubmit} className="post-form">
        <label className="form-label">Title:</label>
        <input
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
        />
        
        <label className="form-label">Description:</label>
        <textarea
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
        ></textarea>

        <label className="form-label">Images (URL):</label>
        <input
          type="text"
          name="images"
          value={images}
          onChange={(e) => setImages(e.target.value)}
          className="form-input"
        />

        <label className="form-label">Video Link (URL):</label>
        <input
          type="text"
          name="videoLink"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          className="form-input"
        />

        <label className="form-label">Tags (comma separated):</label>
        <input
          type="text"
          name="tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {/* Internal CSS */}
      <style jsx>{`
        .post-form-container {
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 20px;
          max-width: 600px;
          margin: 20px auto;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .form-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .post-form {
          display: flex;
          flex-direction: column;
        }

        .form-label {
          font-size: 16px;
          margin-bottom: 8px;
          font-weight: 500;
          color: #555;
        }

        .form-input, .form-textarea {
          padding: 10px;
          margin-bottom: 16px;
          font-size: 16px;
          border: 1px solid #ddd;
          border-radius: 8px;
          background-color: #fff;
          box-sizing: border-box;
          width: 100%;
        }

        .form-textarea {
          resize: vertical;
          height: 100px;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: #4A90E2;
          box-shadow: 0 0 5px rgba(74, 144, 226, 0.5);
        }

        .submit-btn {
          background-color: #4A90E2;
          color: white;
          padding: 12px 18px;
          font-size: 16px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
          margin-top: 10px;
        }

        .submit-btn:hover {
          background-color: #357ABD;
        }

        .submit-btn:active {
          background-color: #285E8E;
        }
      `}</style>
    </div>
  );
}

export default PostForm;
