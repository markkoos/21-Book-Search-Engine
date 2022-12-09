// import the user model
const { User } = require('../models');
// import sign token function from auth
const { signToken } = require('../utils/auth');

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
        addUser: async (parent, args) => {
            const user = await User.create(args);

            const token = signToken(user);

            return { token, user };
        },
        // logs user in, signs token and returns both
        login: async (parent, args) => {
            const user = await User.findOne({ $or: [{ username: args.username }, { email: args.email } ]});
            
            if (!user) {
                return res.status(400).json({ message: "Can't find this user" });
              }
            
            const correctPw = await user.isCorrectPassword(args.password);

            if (!correctPw) {
                return res.status(400).json({ message: 'Wrong password!' });
            }

            const token = signToken(user);
            
            return { token, user };
        },
        // finds user with matching id, then saves the bookId to savedBooks, then returns the updated user
        saveBook: async (parent, {_id, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id },
                { $addToSet: { savedBooks: bookId }}, 
                { new: true, runValidators: true },
            );
            
            return updatedUser;
        },
        // finds user with matching id, then removes the matching bookId from savedBooks, then returns updated user
        removeBook: async (parent, {_id, bookId }) => {
            const updatedUser = await User.findOneAndUpdate(
                { _id },
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