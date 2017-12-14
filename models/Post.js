/*
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    titulo: {
        type: String,
        default:''
    },
    img: {
        type: String,
        default: '',
        required: true
    },
    categoria: [{
        type: String,
        required: true
    }],
    fecha: {
        type: String,
        default: ''
    }
});

var Post = mongoose.model('Post', PostSchema);

module.exports = Post;
*/