const express = require('express');
const router = express.Router();
const Author = require('../models/author.schema');
const Book = require('../models/book.schema')

router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name !== null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const authors = await Author.find(searchOptions)
        res.render("authors/index", {
            authors: authors,
            searchOptions: req.query
        })
    } catch{
        res.redirect('/')
    }

})


router.get('/new', (req, res) => {
    res.render("authors/new", {
        author: new Author()
    })
})

router.post('/', async (req, res) => {
    const authors = new Author();
    authors.name = req.body.name;
    try {
        const newAuthor = await authors.save()

        res.redirect(`/authors/${authors.id}`)
    } catch{
        res.render('authors/new', {
            authors: authors,
            errorMessage: 'Error creating author'
        })
    }

})

router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id)
        const books = await Book.find({ author: author.id }).limit(6).exec()
        //console.log(books)
        res.render('authors/show', {
            authors: author,
            bookByAuthor: books,
        })

    } catch{
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const authors = await Author.findById(req.params.id)
        res.render('authors/edit', {
            authors: authors
        })
    } catch{
        res.redirect('authors')
    }
})

router.put('/:id', async (req, res) => {
    let authors
    try {
        authors = await Author.findByIdAndUpdate(req.params.id, req.body)
        await authors.save()

        res.redirect(`/authors/${authors.id}`)
    } catch{
        res.render('authors/edit', {
            authors: authors,
            errorMessage: 'Error Updating author'
        })
    }

})

router.delete('/:id', async (req, res) => {
    let authors
    try {
        authors = await Author.findById(req.params.id)
        await authors.remove()
        res.redirect(`/authors`)
    } catch{
        if (authors == null) {
            res.redirect(`/`)
        } else {
            res.redirect(`/authors/${authors.id}`)
        }

    }
})

module.exports = router