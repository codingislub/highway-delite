import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import { useSearch } from '../App'

export type ExperienceListItem = {
  _id: string
  id: number
  title: string
  location: string
  pricePerPerson: number
  price_per_person: number
  imageUrl: string
  image_url: string
  rating: number
  reviewsCount: number
  reviews_count: number
  totalCapacity: number
  total_capacity: number
}

export default function Home() {
  const [data, setData] = useState<ExperienceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { searchQuery } = useSearch()

  useEffect(() => {
    let mounted = true
    api
      .get<{ data: ExperienceListItem[] }>('/experiences')
      .then((res) => mounted && setData(res.data.data))
      .catch(() => mounted && setError('Failed to load experiences'))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  // Filter experiences based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) {
      return data
    }
    
    const query = searchQuery.toLowerCase()
    return data.filter((e) => {
      const title = e.title.toLowerCase()
      const location = e.location.toLowerCase()
      return title.includes(query) || location.includes(query)
    })
  }, [data, searchQuery])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse space-y-8">
          <div className="h-10 bg-gray-200 rounded w-64"></div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-xl h-96 border border-gray-200"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium">{error}</div>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Hero Section */}
      <div className="mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
          Discover Unique Experiences
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl">
          Book unforgettable adventures around the world. From hot air balloon rides to food tours, find your next journey.
        </p>
      </div>

      {/* Experience Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredData.map((e) => {
          const id = e.id || e._id
          const price = e.price_per_person || e.pricePerPerson
          const imageUrl = e.image_url || e.imageUrl
          const reviewsCount = e.reviews_count || e.reviewsCount
          const totalCapacity = e.total_capacity || e.totalCapacity
          
          return (
            <Link
              to={`/experience/${id}`}
              key={id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="relative overflow-hidden">
                <img 
                  src={imageUrl} 
                  className="h-56 w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  alt={e.title} 
                />
              </div>
              
              <div className="p-5">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {e.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {e.location}
                </p>
                
                <div className="flex items-center justify-between text-sm pt-3 border-t border-gray-100">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-medium text-gray-900">{e.rating}</span>
                    <span className="ml-1">({reviewsCount})</span>
                  </div>
                  
                  {totalCapacity > 0 ? (
                    <span className="text-green-600 font-medium">{totalCapacity} spots left</span>
                  ) : (
                    <span className="text-red-600 font-medium">Sold out</span>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {filteredData.length === 0 && !loading && !error && (
        <div className="text-center py-16">
          <div className="text-gray-400 text-lg">
            {searchQuery ? `No experiences found matching "${searchQuery}"` : 'No experiences available at the moment.'}
          </div>
        </div>
      )}
    </div>
  )
}

