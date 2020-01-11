const express = require('express');
const router = express.Router();
const Books = require('../models/book.schema');

router.get('/', async (req, res)=>{
    let books
    try{
        books = await Books.find().sort({createdAt: 'desc'}).limit(10).exec()
        res.render("dashboard", {
            book: books,
        })


    }catch{
        books=[]
    }
    
})

module.exports = router