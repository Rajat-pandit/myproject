import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ThumbUpIcon from '@mui/icons-material/ThumbUp'; 
import MoreVertIcon from '@mui/icons-material/MoreVert'; 
import './MyPostList.css'; 

function MyPostList() {
    const [posts, setPosts] = useState([]);
    const [showDeleteModal, setShowDeleteModal] = useState(false); 
    const [selectedPostId, setSelectedPostId] = useState(null); 
    const userName = localStorage.getItem('userName');

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/myposts/${userName}`, {
                    withCredentials: true,
                });
                setPosts(response.data);
            } catch (error) {
                console.error('Error fetching my posts:', error);
            }
        };

        if (userName) {
            fetchMyPosts();
        }
    }, [userName]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:3001/post/${selectedPostId}`, {
                withCredentials: true,
            });
            setPosts(posts.filter(post => post._id !== selectedPostId)); // Remove the post from the list
            setShowDeleteModal(false); 
            alert("Post deleted successfully");
        } catch (error) {
            console.error("Error deleting the post:", error);
            alert("Error deleting the post");
        }
    };

    const openDeleteModal = (postId) => {
        setSelectedPostId(postId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
    };

    return (
        <div className="post-list-container">
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post._id} className="post-card">
                        <div className="post-header">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <img
                                    src={`http://localhost:3001/${post.userImage}`}
                                    alt="User"
                                    style={{width: '40px', height: '40px', borderRadius: '50%', marginRight: '10px',}}/>
                                <h6>{post.userName}</h6>
                            </div>
                            <div className="menu-icon" style={{ position: 'absolute', right: '10px', top: '10px' }}>
                                <MoreVertIcon onClick={() => openDeleteModal(post._id)} />
                            </div>
                        </div>
                        <div className="post-content">
                            <h3>{post.postContent}</h3>
                            {post.image && (
                                <div>
                                    <img
                                        src={`http://localhost:3001/${post.image}`}
                                        alt="Post"
                                        className="post-image"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="like-button-container">
                            <ThumbUpIcon style={{ marginRight: '5px' }} />
                            <span>{post.likesCount} Likes</span>
                        </div>
                        <div className="comment-section">
                            <h4>Comments:</h4>
                            {post.comments.length > 0 ? (
                                <div className="comments-list">
                                    {post.comments.map((comment, index) => (
                                        <div key={index} className="comment-item">
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                <img
                                                    src={`http://localhost:3001/${comment.userImage}`}
                                                    alt={comment.userName}
                                                    style={{
                                                        width: '30px',
                                                        height: '30px',
                                                        borderRadius: '50%',
                                                        marginRight: '10px',
                                                    }}
                                                />
                                                <div>
                                                    <strong>{comment.userName}:</strong> {comment.content}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No comments yet.</p>
                            )}
                        </div>
                        <div className="post-footer">
                            <p>Post created: {new Date(post.createdAt).toLocaleDateString()}</p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-posts-message">
                    You haven't posted anything yet.
                </p>
            )}
            {showDeleteModal && (
                <div className="delete-modal">
                    <div className="modal-content">
                        <p>Are you sure you want to delete this post?</p>
                        <div className="modal-buttons">
                            <button onClick={handleDelete}>Yes, Delete</button>
                            <button onClick={closeDeleteModal}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyPostList;
