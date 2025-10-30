import { Link, useSearchParams } from 'react-router-dom'

export default function Result() {
  const [searchParams] = useSearchParams()
  const status = searchParams.get('status')
  const error = searchParams.get('error')
  const isSuccess = status === 'success'

  return (
    <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
      {isSuccess ? (
        <>
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Confirmed</h1>
          <p className="text-gray-600 mb-8">Ref ID: HUF56&SO</p>
          
          <Link
            to="/"
            className="inline-block px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </>
      ) : (
        <>
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Booking Failed</h1>
          <p className="text-gray-600 mb-8">{error || 'Something went wrong. Please try again.'}</p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => window.history.back()}
              className="px-8 py-3 bg-yellow-400 text-gray-900 font-medium rounded-lg hover:bg-yellow-500 transition-colors"
            >
              Try Again
            </button>
            <Link
              to="/"
              className="px-8 py-3 bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </>
      )}
    </div>
  )
}


