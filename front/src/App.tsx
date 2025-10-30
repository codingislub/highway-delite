import { Link, Outlet, useLocation } from 'react-router-dom'
import { createContext, useState, useContext } from 'react'

// Create a context to share search query
type SearchContextType = {
  searchQuery: string
  setSearchQuery: (query: string) => void
}

const SearchContext = createContext<SearchContextType | undefined>(undefined)

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within SearchProvider')
  }
  return context
}

function App() {
  const location = useLocation()
  const showBackButton = location.pathname !== '/'
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {showBackButton && (
                  <button 
                    onClick={() => window.history.back()}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    aria-label="Go back"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                )}
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-900 rounded flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-gray-900">highway<br/>delite</span>
                </Link>
              </div>

              {/* Search Bar */}
              {location.pathname === '/' && (
                <div className="flex-1 max-w-md">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search experiences"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && setSearchQuery(searchQuery)}
                      className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                    />
                    <button 
                      onClick={() => setSearchQuery(searchQuery)}
                      className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 rounded-r-lg font-medium transition-colors"
                    >
                      Search
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <Outlet />
        </main>
      </div>
    </SearchContext.Provider>
  )
}

export default App


