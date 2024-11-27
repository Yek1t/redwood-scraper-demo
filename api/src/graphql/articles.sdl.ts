import { gql } from 'graphql-tag'

export const schema = gql`
  type Article {
    id: Int!
    title: String
    url: String!
    dataSourceId: String!
    timestamp: String!
    content: String
  }

  type Query {
    articles: [Article!]! @skipAuth
    article(id: Int!): Article @skipAuth
  }
`