import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventories: [],
            isLoading: true
        }
    }

    componentDidMount() {
        this.setState({isLoading: true});

        fetch('api/books')
            .then(response => response.json())
            .then(data => this.setState({books: data, isLoading: false}));
    }

    removeBook = async (id) => {
        await fetch(`/api/book/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        })
        console.log("Remove Done!");
        //update book state minus removed item
        let updatedBooks = 
            [...this.state.books].filter(i => i._id !== id);
        this.setState({books: updatedBooks});
    }

    render() {
        const {books, isLoading} = this.state;

        if(isLoading) {
            return <p>Loading...</p>;
        }

        const bookList = books.map(book => {
            return <tr key={book._id}>
                <td style={{whiteSpace: 'nowrap'}}>{book.title}</td>
                <td>{book.author}</td>
                <td>
                    <ButtonGroup>
                        <Button
                            size='sm'
                            color='primary'
                            tag={Link}
                            to={"/books/" + book._id}
                        >Edit
                        </Button>
                        <Button
                            size='sm'
                            color='danger'
                            tag={Link}
                            onClick={() => this.removeBook(book._id)}
                        >Delete
                        </Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <Container fluid>
                    <div className='float-right'>
                        <Button
                            color="success"
                            className="my-4"
                            tag={Link}
                            to="/books/new"
                        >
                        Add Book
                        </Button>
                    </div>
                    <h3>Book List</h3>
                    <Table className='mt-4'>
                        <thead>
                            <tr>
                                <th width="35%">Title</th>
                                <th width="35%">Author</th>
                                <th width="30%">Actions</th>
                            </tr>
                        </thead>
                        <tbody>{bookList}</tbody>
                    </Table>
                </Container>
            </div>
        )
    }
};

export default BookList;