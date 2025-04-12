import React, {useState, useEffect} from 'react';
import {Box, Typography, CircularProgress, IconButton, TextField, Button} from '@mui/material';
import {ThumbUp} from '@mui/icons-material';
import axios from 'axios';
import './PostList.css';

const SERVER_URL= 'http://localhost:3001';

function PostList() {
    const [posts, setPosts]= useState([]);
    const [loading, setLoading]= useState(true);
    const [comments, setComments]= useState({});

    useEffect(()=> {
        const fetchPosts= async () => {
            try{
                const response= await axios.get(`${SERVER_URL}/posts`, {withCredentials:true,});
                setPosts(response.data);
                setLoading(false);
            } catch (error){
                console.error('Error fetching posts:', error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const handleLike= async(postId) => {
        try{
            const response= await axios.post(`${SERVER_URL}/like/${postId}`,{},{withCredentials:true});
            const updatedPosts= posts.map((post) => post._id === postId ? response.data:post);
            setPosts(updatedPosts);
        } catch (error){
            console.error('Error liking post:', error);
        }
    };

    const handleCommentChange= (postId, value)=> {
        setComments((prevState)=> ({
            ...prevState, [postId]:value,
        }));
    };

    const handleCommentSubmit= async (postId,commentText)=> {
        const userName= localStorage.getItem('userName');
        const userImage= localStorage.getItem('userImage');

        if(!userName || !userImage){
            alert('You need to be logged in to comment');
            return;
        }

        try{
            const response = await axios.post(`${SERVER_URL}/comment/${postId}`, {content:commentText, userName,userImage}, {withCredentials:true});
            const updatedPost= response.data;
            setPosts((prevPosts)=>
            prevPosts.map((post) => 
            post._id === updatedPost._id ? updatedPost:post)
        );
        setComments((prevState)=> ({
            ...prevState,
            [postId]: '',
        }));
        } catch (error){
            console.error('Error submitting comment:', error);
            alert('Error submitting comment, please try again');
        }
    };
    return (
        <Box className="post-list-container">
          {loading ? (
            <CircularProgress />
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <Box key={post._id} className="post-card">
                {/* User image and name */}
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <img
                    src={
                      post.userImage
                        ? `${SERVER_URL}/${post.userImage.replace(/\\/g, '/')}`
                        : '/default-avatar.png'
                    }
                    alt={post.userName}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                    }}
                  />
                  <Typography variant="h6">{post.userName}</Typography>
                </Box>
    
                <Typography variant="body1" className="post-content">
                  {post.postContent}
                </Typography>
    
                {post.image && (
                  <img
                    src={`${SERVER_URL}/${post.image.replace(/\\/g, '/')}`}
                    alt="Post"
                    className="post-image"
                  />
                )}
    
                <Box className="like-button-container">
                  <IconButton onClick={() => handleLike(post._id)}>
                    <ThumbUp />
                  </IconButton>
                  <Typography variant="body2">{post.likesCount} Likes</Typography>
                </Box>
    
                <Box className="comment-section">
                  <TextField
                    label="Write a comment..."
                    variant="outlined"
                    fullWidth
                    value={comments[post._id] || ''}
                    onChange={(e) =>
                      handleCommentChange(post._id, e.target.value)
                    }
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() =>
                      handleCommentSubmit(post._id, comments[post._id])
                    }
                  >
                    Comment
                  </Button>
    
                  <Box className="comments-list">
                    {post.comments.map((comment, index) => (
                      <Box key={index} className="comment-item">
                        <Box display="flex" alignItems="center" gap={1}>
                          <img
                            src={
                              comment.userImage
                                ? `${SERVER_URL}/${comment.userImage.replace(/\\/g, '/')}`
                                : '/default-avatar.png'
                            }
                            alt={comment.userName}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              objectFit: 'cover',
                            }}
                          />
                          <Typography variant="body2">
                            <strong>{comment.userName || 'Unknown'}:</strong>{' '}
                            {comment.content}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          {new Date(comment.createdAt).toLocaleString()}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="h6">No posts available</Typography>
          )}
        </Box>
      );
    }
    
    export default PostList;
    