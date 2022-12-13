import { gql } from '@apollo/client';

// this file executes the mutations defined on typeDefs

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
            user {
                _id
                username
            }
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($_id: ID!, $input: BookInput) {
        saveBook(_id: $_id, input: $input) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        } 
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($_id: ID!, $bookId: String!) {
        removeBook(_id: $_id, bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                bookId
                authors
                description
                title
                image
                link
            }
        }
    }
`;