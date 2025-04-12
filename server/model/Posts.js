const mongoose = require('mongoose');

const postSchema= new mongoose.Schema(
    {
        postContent:{
            type:String,
            required:true,
            trim:true,
        },
        image:{
            type:String,
            required:false,
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
        },
        userName:{
            type:String,
            required:true,
        },
        userImage:{
            type:String,
            required:true,
        },
        likes:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            },
        ],
        likesCount:{
            type:Number,
            default:0,
        },
        comments:[
            {
                user:{
                    type:mongoose.Schema.Types.ObjectId,
                    ref:'User',
                },
                userName:{
                    type:String,
                    required:false,
                },
                userImage:{
                    type:String,
                    required:false,
                },
                content:{
                    type:String,
                    required:true,
                },
                createdAt:{
                    type:Date,
                    default:Date.now,
                },
            }
        ],
    },
    {
        timestamps:true,

    }
);

const Post= mongoose.model('Post', postSchema);
module.exports= Post;
