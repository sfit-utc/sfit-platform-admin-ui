import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Authentication - SFIT Platform',
  description: 'Login or register to access SFIT Platform',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-green-500 p-12 items-center justify-center relative overflow-hidden">
          {/* Background Illustration */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Image
              src="/src/assets/images/auth/login-illustration.svg"
              alt="Learning illustration"
              width={500}
              height={400}
              className="w-full h-full object-contain"
            />
          </div>
          
          <div className="text-center text-white z-10 relative">
            <div className="flex items-center justify-center mb-8">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mr-4">
                <span className="text-green-500 font-bold text-2xl">S</span>
              </div>
              <h1 className="text-4xl font-bold">SFIT</h1>
            </div>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Nền tảng học tập thông minh<br />
              Trải nghiệm học tập hiện đại với công nghệ AI
            </p>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-6 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">99</div>
                <div className="text-sm text-green-100">Sinh viên đang học</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">70</div>
                <div className="text-sm text-green-100">Thành viên</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">30</div>
                <div className="text-sm text-green-100">Lớp học mới</div>
              </div>
            </div>
          </div>
          
          {/* Decorative circles */}
          <div className="absolute top-20 right-20 w-32 h-32 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute top-1/2 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"></div>
          <div className="absolute bottom-40 right-40 w-20 h-20 bg-white bg-opacity-10 rounded-full"></div>
        </div>

        {/* Right side - Auth forms */}
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>  )
}
