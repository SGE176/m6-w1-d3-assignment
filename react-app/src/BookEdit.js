import React, { Component } from 'react';
//import AppNavbar from './Navbar';
import {Link, withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css';

class BookEdit extends Component {
    emptyBook = {
        title: '',
        author: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            item: this.emptyBook
        }
    };

    async componentDidMount() {
        if (this.props.match.param.id !== 'new') {
            const book = 
                await (await fetch(`/api/book/${this.props.match.params.id}`)).json();
                this.setState({item: book});
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        const {item} = this.state;

        await fetch('/api/book', {
            method: (item._id) ? 'PUT' : 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
        });
        this.props.history.push('/books');
    }

    render() {
        const {item} = this.state;
        const title = 
            <h2 className='mt-3'>
                {item._id ? 'Edit Book' : 'Add Book'}
            </h2>;
            return(
                <div>
                    <Container>
                        {title}
                        <Form onSubmit={this.handleSubmit}>
                            <FormGroup>
                                <Label 
                                    for="title"
                                    className='h5 mt-3'
                                >Title</Label>
                                <Input 
                                    type='text'
                                    name='title'
                                    id='title'
                                    value={item.title || ''}
                                    onChange={this.handleChange}
                                    autoComplete='title'
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Label 
                                    for="author"
                                    className='h5 mt-3'
                                >Author</Label>
                                <Input 
                                    type='text'
                                    name='author'
                                    id='author'
                                    value={item.author || ''}
                                    onChange={this.handleChange}
                                    autoComplete='author'
                                    />
                            </FormGroup>
                            <FormGroup>
                                <Button
                                    color="primary"
                                    type="submit"
                                    className='mt-3'
                                >Save</Button>{' '}
                                <Button
                                    color="secondary"
                                    className='mt-3'
                                    tag={Link} to="/books"
                                >Cancel</Button>
                            </FormGroup>
                        </Form>
                    </Container>
                </div>
            )
    }
};

export default withRouter(BookEdit);