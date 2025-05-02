const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, 
  fromUserName: String,  
  fromUserImage: String, 
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, 
  message: String,      
  type: String,         
  isRead: { type: Boolean, default: false }, 
  createdAt: { type: Date, default: Date.now }, 
});

module.exports = mongoose.model('Notification', notificationSchema);
