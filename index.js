const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const path = require( 'path' );

//define el esquema de GraphQL
const typeDefs = gql`
    type Query {
        hello(message: String!): String
    }
`;

//define los resolver de GraphQL
const resolvers = {
    Query: {
        hello: (_, { message }) => {
            return `¡Hola, ${message}! un saludo del curso DSW2`;
        },
    },
};

async function startApolloServer(){
    //crea la instancia de Apollo Server
    const server = new ApolloServer({ typeDefs, resolvers});
    
    //inicia el servidor Apollo
    await server.start();

    //crea la aplicacion express
    const app = express();

    //Aplica el middleware
    server.applyMiddleware({ app, path: '/graphql' });

    const reactAppPath = path.join(__dirname, 'saludofront-app', 'dist');
    app.use(express.static(reactAppPath));
    app.get('*', (req, res) => {
        res.sendFile(path.join(reactAppPath, 'index.html'));
    });

    //Inicio el servidor
    const PORT = 4000;
    app.listen(PORT, () => {
        console.log(`Servidor GraphQL ejecuntandose en http://localhost:${PORT}${server.graphqlPath} `)
    });
}

startApolloServer();