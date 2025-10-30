import { FormEvent, useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { api } from '../services/api'

type ExperienceDetail = {
  title: string
  pricePerPerson?: number
  price_per_person?: number
  imageUrl?: string
  image_url?: string
}

export default function Checkout() {
  const { id } = useParams<{ id: string }>()
  const [params] = useSearchParams()
  const slot = params.get('slot')
  const peopleCount = parseInt(params.get('people') || '1')
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [promo, setPromo] = useState('')
  const [discount, setDiscount] = useState<number>(0)
  const [promoApplied, setPromoApplied] = useState<string>('')
  const [promoError, setPromoError] = useState<string>('')
  const [experience, setExperience] = useState<ExperienceDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  useEffect(() => {
    if (!id) return
    let mounted = true
    api
      .get(`/experiences/${id}`)
      .then((res) => {
        if (mounted) {
          setExperience(res.data.data)
        }
      })
      .catch(() => mounted && setError('Failed to load experience'))
    return () => {
      mounted = false
    }
  }, [id])

  const price = experience?.price_per_person || experience?.pricePerPerson || 0
  const subtotal = price * peopleCount
  const taxes = Math.round(subtotal * 0.06)
  const finalAmount = discount ? subtotal + taxes - discount : subtotal + taxes

  const checkPromo = async () => {
    if (!promo.trim()) return
    try {
      const r = await api.post('/promo/validate', { code: promo })
      if (r.data.valid) {
        setDiscount(r.data.discount)
        setPromoApplied(promo)
      }
    } catch {
      setDiscount(0)
      setPromoApplied('')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!name || !email || !id || !slot || peopleCount < 1 || !agreedToTerms) return

    setIsSubmitting(true)
    try {
      await api.post('/bookings', {
        name,
        email,
        experienceId: id,
        slotId: slot,
        peopleCount,
        promoCode: promoApplied || undefined
      })
      navigate('/result?status=success')
    } catch (err: any) {
      const msg = err?.response?.data?.error || 'Booking failed'
      navigate(`/result?status=fail&error=${encodeURIComponent(msg)}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="text-red-600 font-medium">{error}</div>
        </div>
      </div>
    )
  }

  if (!experience) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse grid lg:grid-cols-2 gap-8">
          <div className="h-96 bg-gray-200 rounded-xl"></div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => window.history.back()} className="text-gray-600 hover:text-gray-900">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-2xl font-semibold text-gray-900">Checkout</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  placeholder="Your email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Promo code</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value.toUpperCase())}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
                />
                <button 
                  type="button" 
                  onClick={checkPromo} 
                  className="px-6 py-2 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="w-4 h-4 text-yellow-400 border-gray-300 rounded focus:ring-yellow-400"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I agree to the terms and safety policy
              </label>
            </div>
          </form>
        </div>

        {/* Summary Section */}
        <div>
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
              <p className="text-gray-700">{experience.title}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Date</p>
                <p className="text-gray-900 font-medium">2025-10-22</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Time</p>
                <p className="text-gray-900 font-medium">09:00 am</p>
              </div>
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-1">Qty</p>
              <p className="text-gray-900 font-medium">{peopleCount}</p>
            </div>

            <div className="space-y-2 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-700 text-sm">
                <span>Taxes</span>
                <span>₹{taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 text-sm">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-xl font-semibold">Total</span>
              <span className="text-2xl font-bold">₹{finalAmount}</span>
            </div>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !agreedToTerms}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Processing...' : 'Pay and Confirm'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

