import gql from 'graphql-tag';
import {
  typeDefs as User,
  resolvers as userResolver
} from './users';
import { makeExecutableSchema } from 'graphql-tools';

const GraphQLJSON = require("graphql-type-json");
const CustomGraphQLDateType = require("graphql-custom-datetype");

const Schema = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

const Scalars = gql`
scalar JSON
scalar Date
`

const resolvers = {
  JSON: GraphQLJSON,
  Date: CustomGraphQLDateType
};

export default makeExecutableSchema({
  typeDefs: [
    Scalars,
    Schema,
    User
  ],
  resolvers: [
    resolvers,
    userResolver
  ]
})