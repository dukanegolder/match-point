const { gql } = require('apollo-server-express')

const typeDefs = gql`
type User {
    _id: ID!
    username: String!
    email: String!
    phoneNumber: String
    team: [Team]
}

type Team {
    _id: ID!
    name: String!
    sport: String!
    events: [Events]
}

type Events {
    _id: ID!
    name: String!
    date: String!
    time: String!
    team1: [Team]
    team2: [Team]
}

type Auth {
    token: ID!
    user: User
}

type Query {
    users: [User]
    user(_id: String): [User]
    teams: [Team]
    team(_id: String): [Team]
    events: [Events]
    event(_id: String): [Events]
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!, phoneNumber: String): Auth
    addTeam(name: String!, sport: String!, events: ID!): Team
    addEvent(name: String!, date: String!, time: String!, team1: ID!, team2: ID!): Events
}
`

module.exports = typeDefs