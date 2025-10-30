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

// Mock data for when API is unavailable
const mockExperiences: ExperienceListItem[] = [
  {
    _id: '1',
    id: 1,
    title: 'Mountain Hiking Adventure',
    location: 'Colorado Rockies',
    pricePerPerson: 299,
    price_per_person: 299,
    imageUrl: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    image_url: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    rating: 4.8,
    reviewsCount: 124,
    reviews_count: 124,
    totalCapacity: 12,
    total_capacity: 12
  },
  {
    _id: '2',
    id: 2,
    title: 'Coastal Kayaking Tour',
    location: 'California Coast',
    pricePerPerson: 189,
    price_per_person: 189,
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    image_url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800',
    rating: 4.9,
    reviewsCount: 98,
    reviews_count: 98,
    totalCapacity: 8,
    total_capacity: 8
  },
  {
    _id: '3',
    id: 3,
    title: 'Desert Sunset Safari',
    location: 'Arizona Desert',
    pricePerPerson: 249,
    price_per_person: 249,
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    image_url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    rating: 4.7,
    reviewsCount: 156,
    reviews_count: 156,
    totalCapacity: 15,
    total_capacity: 15
  },
  {
    _id: '4',
    id: 4,
    title: 'Forest Camping Experience',
    location: 'Pacific Northwest',
    pricePerPerson: 199,
    price_per_person: 199,
    imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    image_url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800',
    rating: 4.6,
    reviewsCount: 87,
    reviews_count: 87,
    totalCapacity: 10,
    total_capacity: 10
  },
  {
    _id: '5',
    id: 5,
    title: 'Whitewater Rafting',
    location: 'Montana Rivers',
    pricePerPerson: 279,
    price_per_person: 279,
    imageUrl: 'https://images.unsplash.com/photo-1490131504990-34e52085528b?w=800',
    image_url: 'https://images.unsplash.com/photo-1490131504990-34e52085528b?w=800',
    rating: 4.9,
    reviewsCount: 143,
    reviews_count: 143,
    totalCapacity: 6,
    total_capacity: 6
  },
  {
    _id: '6',
    id: 6,
    title: 'Rock Climbing Course',
    location: 'Utah Canyons',
    pricePerPerson: 329,
    price_per_person: 329,
    imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
    image_url: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800',
    rating: 4.8,
    reviewsCount: 92,
    reviews_count: 92,
    totalCapacity: 8,
    total_capacity: 8
  }
]

export default function Home() {
  const [data, setData] = useState<ExperienceListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { searchQuery } = useSearch()

  useEffect(() => {
    let mounted = true
    console.log('API Base URL:', import.meta.env.VITE_API_URL || 'http://localhost:4000')
    api
      .get<{ data: ExperienceListItem[] }>('/experiences')
      .then((res) => {
        console.log('API Success:', res.data)
        mounted && setData(res.data.data)
      })
      .catch((err) => {
        if (mounted) {
          // Use mock data if API fails
          console.error('API Error:', err.message, err.response?.status)
          console.warn('Using mock data as fallback')
          setData(mockExperiences)
        }
      })
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

