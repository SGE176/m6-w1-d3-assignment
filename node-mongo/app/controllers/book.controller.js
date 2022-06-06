const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);
// mongoose.connect(CONNECTION_URL).then(()=>{console.log('...')});
const Book = mongoose.model('Book');

exports.createBook = (req, res) => {
    const book = new Book({
        id: req.body.id,
        title: req.body.title,
        author: req.body.author
        });
    // Save a Book in the MongoDB
    book.save().then(data=>{
        res.status(200).json(data);
    }).catch(err => {
        res.status(500).json({
            message:"Fail!",
            error: err.message
        });
    });
};

exports.getBook = (req, res) => {
    Book.findById(req.param.id).select('-__v')
        .then(inventory => {
            res.status(200).json(inventory);
        }).catch(err => {
            if(err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: "Book not found with id " + req.param.id,
                    error: err 
                });
            }
            return res.status(500).send({
                message: "Error retrieving Book with id " + req.params.id,
                error:err
            });
        });
};


exports.books = (req, res) => {
    Book.find().select('-__v').then(bookInfos => {
        res.status(200).json(bookInfos);
    }).catch(error => {
        // log on console
        console.log(error);

        res.status(500).json({
            message:"Error!",
            error: error
        })
    })
};


exports.deleteBook = (req, res) => {
    Book.findByIdAndRemove(req.param.id).select('-__v-_id')
        .then(book => {
            if(!book) {
                res.status(404).json({
                    message: "No book found with id = " + req.params.id,
                    error: "404"
                })
            }
            res.status(200).json({});
        }).catch(err => {
            return res.status(500).send({
                message: "Error -> Can't delete book with id = " + req.params.id,
                error: err.message
            })
        })
};

exports.updateBook = (req, res) => {
    //Find inventory an update it
    Book.findByIdAndUpdate(
        req.body._id,
        {
            id: req.body.id,
            title: req.body.title,
            author: req.body.author
        },
        {new: false}
    ).select('-__v')
        .then(book => {
            if(!book) {
                return res.status(404).send({
                    message: "Error -> Can't update an book with id = " + req.params.id,
                    error: "Not Found!"
                })
            }
            res.status(200).json(book);
        }).catch(err => {
            return res.status(500).send({
                message: "Error => Can't update a book with id = " + req.params.id,
                error: err.message
            })
        })
};


