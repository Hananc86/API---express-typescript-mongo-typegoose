import { ApolloServer, AuthenticationError } from "apollo-server-express";
import * as http from 'http';
import schema from './schema/index';
import config from "./config";
import GQLContext from "./shared/GQLContext";
import * as mongoose from 'mongoose';
const { db: { host, password, username } } = config;
const options : mongoose.ConnectionOptions = {
    useNewUrlParser: true,
    poolSize: 1,
    keepAlive: true,
    connectTimeoutMS: 300000,
    bufferMaxEntries: 0
};
mongoose.connect(`mongodb+srv://${username}:${password}@${host}`, options);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we're connected!")
});

const express = require('express');
const cors = require('cors');
const url = require('url');
const PORT = process.env.PORT || 5200;

var app = express();
app.use(cors());

const extractToken = ctx => {
    const parsed = url.parse(ctx.url, true);

    let token = parsed.query["token"];
    if (!ctx.headers.authorization && !token) return;
    
    if (!token) {
        const components = ctx.headers.authorization.split(" ");
        const scheme = components[0];
        if (scheme !== "Bearer") return;
        token = components[1];
    }
    return token;
};

const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
        // debugger;
        if (!req) {
            // subscription context
            return;
        }
        if (((req['body'].query as string) || '').indexOf('IntrospectionQuery') > -1) {
            if (process.env.NODE_ENV === 'production' && req.headers['x-prod-introspection'] !== 'your mom') {
                throw new AuthenticationError('Introspection not allowed');
            }
            return;
        }
        // batched queries
        if (req['body'][0] && req['body'].filter(q => (q.query || '').indexOf('IntrospectionQuery') > -1).length) {
            return;
        }
        const token = extractToken(req);
        try {
            return {
                email: "bennymalev@gmail.com",
                token
            } as GQLContext;
        } catch (error) {
            throw new AuthenticationError(error.error);
        }
    },
    introspection: true,
    // tracing: true,
    // engine: {
    //     apiKey: config.engineApiKey
    // }
});

server.applyMiddleware({ app, bodyParserConfig: { limit: '50mb' } });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () => {
    console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    );
});