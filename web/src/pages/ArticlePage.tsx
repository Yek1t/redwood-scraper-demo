import { useQuery } from '@redwoodjs/web'
import { Link, useParams } from '@redwoodjs/router'

const ARTICLE_QUERY = gql`
  query ArticleQuery($id: Int!) {
    article(id: $id) {
      id
      title
      url
      dataSourceId
      timestamp
      content
    }
  }
`

const ArticlePage = () => {
  const { id } = useParams()
  const { loading, error, data } = useQuery(ARTICLE_QUERY, {
    variables: { id: parseInt(id) },
  })

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const article = data.article

  return (
    <div>
      <Link to="/articles">
        ← Back to Articles
      </Link>

      <article>
        <h1>{article.title}</h1>

        <div>
          <p>Source: {article.dataSourceId}</p>
          <p>Published: {new Date(article.timestamp).toLocaleDateString()}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Original Article
          </a>
        </div>

        <div>
          {article.content}
        </div>
      </article>
    </div>
  )
}

export default ArticlePage