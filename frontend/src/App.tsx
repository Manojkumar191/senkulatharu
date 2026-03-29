import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Blog from './pages/Blog'
import Admin from './pages/Admin'

export type Page = 'home' | 'products' | 'about' | 'blog' | 'admin'

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home')

  const navigateTo = (page: Page) => {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header onNavigate={navigateTo} currentPage={currentPage} />
      <main className="flex-grow">
        {currentPage === 'home' && <Home onNavigate={navigateTo} />}
        {currentPage === 'products' && <Products />}
        {currentPage === 'about' && <About />}
        {currentPage === 'blog' && <Blog />}
        {currentPage === 'admin' && <Admin />}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  )
}

export default App
