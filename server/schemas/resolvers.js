// import the user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');
// import authentication error function
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        // query to find a user
        me: async (parent, {_id}) => {
          const params = _id ? {_id} : {};

          return User.find(params);   
        },
    },
    Mutation: {
        // creates user, signs token, and returns both
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });

            const token = signToken(user);

            return { token, user };
        },
        // logs user in, signs token and returns both
        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });
            
            if(!user) {
                throw new AuthenticationError('No user with this email was found');
            }
            
            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw new AuthenticationError('Wrong password');
            }

            const token = signToken(user);
            
            return { token, user };
        },
        // finds user with matching id, then saves the bookId to savedBooks, then returns the updated user
        saveBook: async (parent, {_id, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: _id },
                { $addToSet: { savedBooks: bookId }}, 
                { new: true, runValidators: true },
            );
            
            return updatedUser;
        },
        // finds user with matching id, then removes the matching bookId from savedBooks, then returns updated user
        removeBook: async (parent, {_id, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id: _id },
                { $pull: { savedBooks: bookId }},
                { new: true }            
            );

            if (!updatedUser) {
                return res.status(404).json({ message: "Couldn't find user with this id!" });
            }

            return updatedUser;
        }
    }
};

module.exports = resolvers;