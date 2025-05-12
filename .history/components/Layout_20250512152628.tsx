import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <header className="bg-black border-b border-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                3D Product Configurator
              </h1>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">Home</a>
              <a href="#" className="hover:text-blue-400 transition-colors duration-200">About</a>
              <a href="#" className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-md transition-colors duration-200">Contact</a>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-black border-t border-gray-800 shadow-inner mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-400 text-sm">
          <div className="flex justify-center items-center space-x-4 mb-4">
            <a href="#" className="hover:text-blue-400 transition-colors">Twitter</a>
            <a href="#" className="hover:text-blue-400 transition-colors">GitHub</a>
            <a href="#" className="hover:text-blue-400 transition-colors">LinkedIn</a>
          </div>
          &copy; {new Date().getFullYear()} 3D Product Configurator. All rights reserved.
        </div>
      </footer>
    </div>
  );
} 