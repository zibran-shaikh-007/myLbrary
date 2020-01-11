if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodoverride = require('method-override')
const cloudinary = require('cloudinary').v2
const port = process.env.port || 8888;
const libraryRoute = require("./routes/index");
const authorsRoute = require('./routes/author');
const booksRoute = require('./routes/book');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodoverride('_method'))

//template setup
let hbs = exphbs.create({
       extname: 'hbs',
    //partialsDir: 'views/authors',
    helpers:{
        ifeq: function(a, b, options){
            if (a === b) {
              return options.fn(this);
              }
            return options.inverse(this);
          },

    }
    
})
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

//Database setup
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
let DB = mongoose.connection;

DB.on('err', (err) => console.error(`Error ${err} has occured`));
DB.once('open', () => console.log(`Database has connected`));

//cloudinary setup
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
})

app.use('/', libraryRoute);
app.use('/authors', authorsRoute);
app.use('/books', booksRoute)

app.listen(port, () => console.log(`Connected to the port ${port} and running`))

