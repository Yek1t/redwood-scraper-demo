import { useQuery } from '@redwoodjs/web'
import { Link, routes } from '@redwoodjs/router'

const ARTICLES_QUERY = gql`
  query ArticlesQuery {
    articles {
      id
      title
      url
      dataSourceId
      timestamp
    }
  }
`

const ArticlesPage = () => {
  const { loading, error, data } = useQuery(ARTICLES_QUERY)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <h1>Crypto News Articles</h1>

      <div>
        {data.articles.map((article) => (
          <div key={article.id}>
            <h2>
              <Link to={routes.article({ id: article.id })}>
                {article.title || 'Untitled Article'}
              </Link>
            </h2>

            <div>
              <span>{article.dataSourceId}: </span>
              <span>{new Date(article.timestamp).toLocaleDateString()}</span>
            </div>

            <div>
              <Link to={routes.article({ id: article.id })}>
                Read More
              </Link>
              <span> | </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                 View Original
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ArticlesPage