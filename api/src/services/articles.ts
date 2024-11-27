import { db } from 'src/lib/db'

export const articles = () => {
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
}

export const article = ({ id }) => {
  return db.article.findUnique({
    where: { id },
  })
}