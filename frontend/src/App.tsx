import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import CatalogueGenerator from './pages/CatalogueGenerator'
import TrendAnalyzer from './pages/TrendAnalyzer'
import Preview from './pages/Preview'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/preview" element={<Preview />} />
        <Route path="/" element={<Navigate to="/catalogue" replace />} />
        <Route
          path="/catalogue"
          element={
            <Layout>
              <CatalogueGenerator />
            </Layout>
          }
        />
        <Route
          path="/trends"
          element={
            <Layout>
              <TrendAnalyzer />
            </Layout>
          }
        />
      </Routes>
    </Router>
  )
}

export default App


