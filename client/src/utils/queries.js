import { gql } from '@apollo/client';

// this file executes the queries defined up on the typeDefs file

export const GET_ME = gql`
    query me {
        me {
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