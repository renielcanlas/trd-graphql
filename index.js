const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')

let trds = []

const typeDefs = gql`
    type TRD {
        id: String!, 
        language: String!,
        value: String!
    }

    type Query {
        getTRD(id: String!, language: String!): TRD
        listTRDs: [TRD]
    }

    type Mutation {
        saveTRD(id: String!, language: String!, value: String!): TRD
    }
`;

const resolvers = {
    Query: {
        getTRD: (parent, args) => trds.find(trd => trd.id === args.id && trd.language === args.language), 
        listTRDs: () => trds
    }, 

    Mutation: {
        saveTRD: (parent, args) => {
            const index = trds.findIndex(trd => trd.id === args.id && trd.language === args.language)
            if (index === -1) {
                const newTRD = {
                    id: args.id, 
                    language: args.language,
                    value: args.value
                }
                trds.push(newTRD)
                return newTRD
            } else {
                const updatedTRD = { ...trds[index], ...args}
                trds[index] = updatedTRD;
                return updatedTRD;
            }
        }
    }
};

const server = new ApolloServer({ typeDefs, resolvers })

const app = express()

const startup = () => server.start().then(() => {
    server.applyMiddleware({
        app, path: '/graphql'
    })
    
    app.listen({port: 3000},
        () => console.log(`TRD GraphQL is running at localhost:3000`)
    )
})

startup();