import { gql } from "apollo-server-core";
import { UserModel } from "../entities";

export const typeDefs = () => [
  gql`
    type User {
        id: Int
        name: String
    }
    extend type Query {
        users: [User!]!
    }
    extend type Mutation {
        createUser(name: String!): User
    }
`
]

export const resolvers = {
  User: {

  },
  Query: {
    // async users () {
    //   // return User.findOne
    // }
  },
  Mutation: {
    createUser: async (obj, { name }, context, info) => {
      try {
        
        // const a = new UserModel({name: 'Hanan'})
        // a.save()
        const a = await UserModel.findOne()
        console.log(a, '*************1111**********');
        return a
      }
      catch (e) {
        console.log(e);
      }
      return true
    }
  }
}