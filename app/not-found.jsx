import { Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 min-h-screen">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Animated 404 */}
            <div className="relative mb-8">
              <h1 className="text-[150px] md:text-[200px] font-bold text-gray-800 select-none">
                404
              </h1>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-green-500 text-6xl md:text-8xl font-bold">
                  404
                </div>
              </div>
            </div>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl"></div>
                <div className="relative bg-gray-800 p-6 rounded-full border border-gray-700">
                  <AlertCircle className="w-12 h-12 text-green-500" />
                </div>
              </div>
            </div>

            {/* Message */}
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
              The page you are looking for might have been removed, had its name
              changed, or is temporarily unavailable.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <Home className="w-5 h-5" />
                Go to Dashboard
              </a>

              <a
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
                Go to Login
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
