const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('cloudinary').v2
// const fs = require('fs');
const Books = require('../models/book.schema');
const Author = require('../models/author.schema');
// const path = require('path');
// const uploadPath = path.join('public', Books.coverImagePath);
const imageMimeType = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg']
const upload = multer({
    // desc: uploadpath,
    storage: multer.diskStorage({}),
    fileFilter: (req, file, cb) => {
        cb(null, imageMimeType.includes(file.mimetype))
    }

});



router.get('/', async (req, res) => {
    let query = Books.find();
    if (req.query.title != null && req.query.title != "") {
        query = query.regex('title', new RegExp(req.query.title, "i"));
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query = query.gte('publishDate', req.query.publishedAfter)
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
        query = query.lte('publishDate', req.query.publishedBefore)
    }

    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query,
        })

    } catch{
        red.redirect('/')
    }



})


router.get('/new', async (req, res) => {
    renderNewPage(res, new Books())

})

router.post('/', upload.single('cover'), async (req, res) => {
    // const fileName = req.file != null ? req.file.filename : null;
    //console.log(req.file)

    let result = await cloudinary.uploader.upload(req.file.path, (err, res) => {
        //console.log(err, res)

    })
    //console.log(result.secure_url)
    const book = new Books();
    book.title = req.body.title,
        book.author = req.body.author,
        book.publishDate = new Date(req.body.publishDate),
        book.pageCount = req.body.pageCount,
        book.coverImageName = result.secure_url,
        book.description = req.body.description

    try {

        const newBook = await book.save();
        //console.log(newBook)

        res.redirect(`books`)


    } catch  {
        
        renderNewPage(res, book, true)

        // if (books.coverImageName != null) {
        //     removeBookCover(books.coverImageName)
        // }
    }

})

// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => {
//         if (err) console.error(err)
//     })
// }


//show book route
router.get('/:id', async (req, res) => {

    try {
        const book = await Books.findById(req.params.id).populate('Author').exec()
        // const author = await Author.find({name: book._id})
        //console.log(author)
        // console.log(book.author.name)
        res.render('books/show', {
            books: book,
            //authors: author

        })

    } catch (err) {
        console.log(err)
        res.redirect('/')
    }
})

//edit page

router.get('/:id/edit', async (req, res) => {
    try {
        const book = await Books.findById(req.params.id)
        renderEditPage(res, book)
    } catch{

        res.redirect('/')
    }
})

router.put('/:id', async (req, res) => {
    let book
    try {
        book = await Books.findById(req.params.id)
        book.author = req.body.author,
        book.publishDate = new Date(req.body.publishDate),
        book.pageCount = req.body.pageCount,
        book.description = req.body.description
        if(req.body.coverImageName != null && req.body.coverImageName !==''){
            saveCover(book, req.body.coverImageName)
        }

        await book.save()
        console.log(book)
        res.redirect(`/books/${book.id}`);

    } catch(err){
        console.log(err)
        if (book != null) {
            renderEditPage(res, book, true)
        } else {
            res.redirect('/books')
        }

    }
})

router.delete('/:id', async(req,res)=>{
    let books
    try{
         books = await Books.findByIdAndDelete(req.params.id, req.body)
        res.redirect(`/books`)
    }catch{
        if(books != null){
            res.render('books/show', {
                books: books,
                errorMessage: 'Could not remove book'
            })
        }else{
            res.render(`/`)
        }
        
    }
})

async function renderNewPage(res, book, hasError = false) {
    renderFormPage(res, book, 'new', hasError)
}

async function renderEditPage(res, book, hasError = false) {
    renderFormPage(res, book, 'edit', hasError)
}

async function renderFormPage(res, book, form, hasError = false) {
    try {
        const authors = await Author.find({})

        const params = {
            authors: authors,
            books: book
        }
        if (hasError) {
            if (form === "edit") {
                params.errorMessage = "Error Editing Book"
            } else {
                params.errorMessage = 'Error Creating Book'
            }
        }
        //console.log(authors)
        res.render(`books/${form}`, params)

    } catch {

        res.redirect('/books')

    }
}

module.exports = router