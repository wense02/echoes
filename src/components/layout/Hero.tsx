import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Heart, Users, Camera, Music } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-serif font-bold text-gray-900 leading-tight">
              Forever in our{' '}
              <span className="text-primary-600 relative">
                hearts
                <Heart className="absolute -top-2 -right-8 h-6 w-6 text-red-400 animate-pulse" />
              </span>
            </h1>
            <p className="text-xl text-gray-600 mt-6 max-w-2xl">
              Create beautiful online memorial websites to honor your loved ones. 
              Share memories, photos, and stories with family and friends from around the world.
            </p>
            
            {/* Features */}
            <div className="flex flex-wrap gap-6 mt-8 justify-center lg:justify-start">
              <div className="flex items-center space-x-2 text-gray-700">
                <Users className="h-5 w-5 text-primary-600" />
                <span className="text-sm">Family Collaboration</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Camera className="h-5 w-5 text-primary-600" />
                <span className="text-sm">Photo Galleries</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-700">
                <Music className="h-5 w-5 text-primary-600" />
                <span className="text-sm">Memory Sharing</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center lg:justify-start">
              <Link
                href="/create"
                className="btn-primary flex items-center justify-center space-x-2 group"
              >
                <span>Create Memorial</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/gallery"
                className="btn-secondary"
              >
                View Gallery
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">200K+</div>
                <div className="text-sm text-gray-600">Memorials Created</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">190M+</div>
                <div className="text-sm text-gray-600">Visitors</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl font-bold text-gray-900">15+</div>
                <div className="text-sm text-gray-600">Years Online</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="/images/hero-memorial.jpg"
                alt="Beautiful memorial website example"
                width={600}
                height={400}
                className="rounded-2xl shadow-2xl"
                priority
              />
              
              {/* Floating Cards */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 animate-fade-in">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <Heart className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">Margaret Johnson</div>
                    <div className="text-xs text-gray-600">1934 - 2024</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 animate-fade-in animation-delay-500">
                <div className="text-xs text-gray-600 mb-1">Latest tribute</div>
                <div className="text-sm text-gray-900 font-medium">
                  &#34;She was the heart of our family...&#34;
                </div>
                <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
              </div>
            </div>

            {/* Background decorations */}
            <div className="absolute top-10 right-10 w-20 h-20 bg-primary-100 rounded-full opacity-20 animate-pulse"></div>
            <div className="absolute bottom-10 left-10 w-16 h-16 bg-blue-100 rounded-full opacity-20 animate-pulse animation-delay-1000"></div>
          </div>
        </div>
      </div>
    </section>
  )
}