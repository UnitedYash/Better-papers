import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/pages/HomePage'
import { CategoriesPage } from '@/pages/CategoriesPage'
import { CategoryPage } from '@/pages/CategoryPage'
import { PapersPage } from '@/pages/PapersPage'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/papers" element={<PapersPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App