// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Router, Route } from '@redwoodjs/router'
import ArticleList from './pages/ArticleList'
import ArticlePage from './pages/ArticlePage'

const Routes = () => {
  return (
    <Router>
      <Route path="/articles" page={ArticleList} name="articles" />
      <Route path="/article/{id:Int}" page={ArticlePage} name="article" />
    </Router>
  )
}

export default Routes
