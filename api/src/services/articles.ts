import { db } from '../lib/db'

export const articles = () => {
  try {
    return db.article.findMany({
      where: {
        OR: [
          { title: { not: null } },
          { content: { not: null } },
        ],
      },
      orderBy: {
        id: 'asc',
      },
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
  }

}

export const article = ({ id }) => {
  return db.article.findUnique({
    where: { id },
  })
}