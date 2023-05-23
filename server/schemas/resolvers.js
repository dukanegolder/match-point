const { User } = require('../models')
const { Team } = require('../models');
const { Events } = require('../models');
const { AuthenticationError } = require('apollo-server-express')
const { signToken } = require('../utils/auth')

const resolvers = {
    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
                return User.findOne({ _id: context.user._id }).populate('teams').populate('events')
            }
            throw new AuthenticationError('You must be logged in')
        },
        users: async () => {
            return User.find({});
        },
        user: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            if (!params) {
                return { message: 'No user found || check id' }
            }
            return User.find(params)
        },
        teams: async () => {
            return Team.find({})
        },
        team: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            if (!params) {
                return { message: 'No team found || check id' }
            }
            return Team.find(params)
        },
        events: async () => {
            return Events.find({})
        },
        event: async (parent, { _id }) => {
            const params = _id ? { _id } : {};
            if (!params) {
                return { message: 'No event found || check id' }
            }
            return Events.find(params)
        }

    },
    Mutation: {
        // signup mutation
        addUser: async (parent, { username, email, password, phoneNumber }) => {
            // create the user with the params
            const user = await User.create({ username, email, password, phoneNumber })
            // sign the token with new user attached
            const token = signToken(user)

            // return the token and the user
            return { token, user }
        },
        // login mutation
        login: async (parent, { email, password }) => {
            // look for user associated with the email
            const user = await User.findOne({ email })

            // if no user exists in db with that email, throw error
            if (!user) {
                throw new AuthenticationError('Username or password is incorrect')
            }

            // test given password against db password for given user
            const correctPw = await user.isCorrectPassword(password)

            // if the password is not correct, throw error
            if (!correctPw) {
                throw new AuthenticationError('Username or password is incorrect')
            }
            // sign token to user
            const token = signToken(user)

            // return token and user
            return { token, user }
        },
        addTeam: async (parent, args) => {
            const newTeam = await Team.create(args);
            return newTeam;
        },
        deleteTeam: async (parent, { teamId }, context) => {
            if (context.user) {
                return Team.findOneAndDelete({ _id: teamId })
            }
            throw new AuthenticationError('Must be logged in to delete teams!')
        },
        // updateTeam: async (parent, { teamId }, context) => {
        //     if (context.user) {
        //         return Team.findOneAndUpdate(
        //             { _id: teamId },
        //             { $addToSet: { Team: {} } },
        //             { new: true }
        //         )
        //     }
        // },
        addEvent: async (parent, args) => {
            const newEvent = await Events.create(args);
            return newEvent;
        },
        deleteEvent: async (parent, { eventId }, context) => {
            if (context.user) {
                return Events.findOneAndDelete({ _id: eventId })
            }
            throw new AuthenticationError('Must be logged in to delete events!')
        },
        // updateEvent: async (parent, { eventId }, context) => {
        //     if (context.user){
        //         return Events.findOneAndUpdate(
        //             { _id: eventId },
        //             {$addToSet: { Events: {} }},
        //             { new: true }
        //         )
        //     }
        // }
    }
}

module.exports = resolvers