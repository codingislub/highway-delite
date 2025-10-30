import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../services/api'

export type Slot = { 
  id: number
  slot_id: string
  _id: string
  date: string
  timeslot: string
  capacity: number
}

export type Experience = {
  _id: string
  id: number
  title: string
  location: string
  description: string
  pricePerPerson: number
  price_per_person: number
  imageUrl: string
  image_url: string
  slots: Slot[]
  rating: number
  reviews_count: number
  reviewsCount: number
}

export default function Details() {
  const { id } = useParams<{ id: string }>()
  const [exp, setExp] = useState<Experience | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<string>('')
  const [peopleCount, setPeopleCount] = useState<number>(1)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api
      .get<{ data: Experience }>(`/experiences/${id}`)
      .then((res) => mounted && setExp(res.data.data))
      .catch(() => mounted && setError('Failed to load experience'))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [id])

  const slotsByDate = useMemo(() => {
    const map = new Map<string, Slot[]>()
    exp?.slots.forEach((s) => {
      const arr = map.get(s.date) || []
      arr.push(s)
      map.set(s.date, arr)
    })
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b))
  }, [exp])

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-2xl mb-6"></div>
          <div className="h-8 bg-gray-200 rounded w-2/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  if (error || !exp) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium">{error || 'Experience not found'}</div>
        </div>
      </div>
    )
  }

  const price = exp.price_per_person || exp.pricePerPerson
  const imageUrl = exp.image_url || exp.imageUrl
  const reviewsCount = exp.reviews_count || exp.reviewsCount

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Image */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-lg">
        <img 
          src={imageUrl} 
          alt={exp.title} 
          className="w-full h-[400px] sm:h-[500px] object-cover" 
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Title & Location */}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">{exp.title}</h1>
            <div className="flex items-center text-gray-600 mb-4">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-lg">{exp.location}</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="font-semibold text-gray-900">{exp.rating}</span>
                <span className="text-gray-600 ml-2">({reviewsCount} reviews)</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">About this experience</h2>
            <p className="text-gray-700 leading-relaxed">{exp.description}</p>
          </div>

          {/* Available Slots */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Select your time slot</h2>
            <div className="space-y-6">
              {slotsByDate.map(([date, slots]) => (
                <div key={date} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="font-medium text-gray-900 mb-3">
                    {new Date(date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {slots.map((s) => {
                      const slotId = s.slot_id || s._id || s.id?.toString()
                      const isSelected = selected === slotId
                      const isSoldOut = s.capacity <= 0
                      
                      return (
                        <button
                          key={slotId}
                          onClick={() => !isSoldOut && setSelected(slotId)}
                          disabled={isSoldOut}
                          className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50 text-blue-700'
                              : isSoldOut
                              ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                              : 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700'
                          }`}
                        >
                          <div>{s.timeslot}</div>
                          <div className="text-xs mt-1">
                            {isSoldOut ? 'Sold out' : `${s.capacity} spots`}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Booking Card - Sticky */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 bg-white rounded-xl border-4 border-yellow-400 p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Starts at</span>
                <span className="text-xl font-semibold">₹{price}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Quantity</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setPeopleCount(Math.max(1, (peopleCount || 1) - 1))}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                  >
                    −
                  </button>
                  <span className="text-lg font-medium w-8 text-center">{peopleCount || 1}</span>
                  <button
                    onClick={() => setPeopleCount((peopleCount || 1) + 1)}
                    className="w-8 h-8 rounded border border-gray-300 hover:bg-gray-100 flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-700">Subtotal</span>
                <span className="font-semibold">₹{price * (peopleCount || 1)}</span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Taxes</span>
                <span className="text-gray-700">₹{Math.round(price * (peopleCount || 1) * 0.06)}</span>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-xl font-bold">₹{Math.round(price * (peopleCount || 1) * 1.06)}</span>
                </div>

                {selected ? (
                  <Link
                    to={`/checkout/${id}?slot=${selected}&people=${peopleCount || 1}`}
                    className="w-full flex items-center justify-center px-6 py-3 rounded-lg bg-yellow-400 text-gray-900 font-semibold hover:bg-yellow-500 transition-colors"
                  >
                    Confirm
                  </Link>
                ) : (
                  <button
                    disabled
                    className="w-full px-6 py-3 rounded-lg bg-gray-200 text-gray-500 font-semibold cursor-not-allowed"
                  >
                    Confirm
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

