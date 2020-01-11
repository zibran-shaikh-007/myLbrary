const mongoose = require('mongoose');
// const path = require('path')
// const coverImagePath = 'uploads/CoverImages';

const bookSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true 
    },
    description: {
        type: String,
        
    },
    publishDate:{
        type: Date,
        required: true

    },
    pageCount:{
        type: Number,
        required: true

    },
    createdAt:{
        type: Date,
        required: true,
        default: Date.now

    },
    coverImageName:{
        type: String,
        required: true
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
        

    },

})

// bookSchema.virtual('coverImageSource').get(function(){
//     if(this.coverImageName != null){
//         return path.join('/', coverImagePath , this.coverImageName)
//     }
   
// })

module.exports = mongoose.model('Books', bookSchema);
// module.exports.coverImagePath = coverImagePath;