import { useState } from 'react'
import { ThemeProvider, BoardProvider } from './context'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Board } from './components/Board'
import { Dashboard } from './components/Dashboard'
import { About } from './components/About'
import { ToastContainer } from './components/Toast'

function AppContent() {
  const [currentPage, setCurrentPage] = useState('board')

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      <main className="flex-1 flex flex-col">
        {currentPage === 'board' && <Board />}
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'about' && <About />}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <BoardProvider>
        <AppContent />
      </BoardProvider>
    </ThemeProvider>
  )
}
