import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Application Tracker Lite
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-700">Hi, {user.name}</span>
                  <Link
                    to="/dashboard"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl leading-tight">
                  Track Your Job Search
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
                    Stay Organized
                  </span>
                </h2>
                <p className="mt-6 text-xl text-gray-600 leading-relaxed">
                  Keep track of your job applications, interviews, and action items all in one place. 
                  Never miss a follow-up or forget where you are in the process.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  {!user && (
                    <>
                      <Link
                        to="/register"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                      >
                        Start Tracking for Free
                        <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </Link>
                      <Link
                        to="/login"
                        className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition-all"
                      >
                        Sign In
                      </Link>
                    </>
                  )}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl transform rotate-6 scale-105 opacity-20"></div>
                <img 
                  src="https://generate.plaiceholder.com?token=tok_5f6b47c572764141b986ef19e9646b451754335687&prompt=realistic photography style professional workspace with laptop displaying job tracking kanban board interface blue accent colors clean modern design" 
                  alt="Job recruitment tracking dashboard" 
                  className="relative rounded-3xl shadow-2xl w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900">Everything You Need to Succeed</h3>
              <p className="mt-4 text-xl text-gray-600">Powerful features to streamline your job search</p>
            </div>

            <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <div className="mb-6">
                    <img 
                      src="https://generate.plaiceholder.com?token=tok_5f6b47c572764141b986ef19e9646b451754335687&prompt=realistic photography style organized desk with job application folders color coded tabs resume papers professional setting" 
                      alt="Track job applications" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Track Applications</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Keep all your job applications organized with company details, status updates, and contact information.
                  </p>
                </div>
              </div>

              <div className="group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <div className="mb-6">
                    <img 
                      src="https://generate.plaiceholder.com?token=tok_5f6b47c572764141b986ef19e9646b451754335687&prompt=realistic photography style task management setup with calendar planner checkboxes highlighted deadlines professional office environment" 
                      alt="Manage action items" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Manage Action Items</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Never miss a follow-up with our action item tracking. Set due dates and mark tasks as complete.
                  </p>
                </div>
              </div>

              <div className="group hover:transform hover:-translate-y-2 transition-all duration-300">
                <div className="bg-white rounded-2xl shadow-xl p-8 h-full">
                  <div className="mb-6">
                    <img 
                      src="https://generate.plaiceholder.com?token=tok_5f6b47c572764141b986ef19e9646b451754335687&prompt=realistic photography style modern display showing analytics dashboard with graphs charts progress metrics blue color scheme" 
                      alt="Monitor progress" 
                      className="w-full h-48 object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Monitor Progress</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Visualize your job search progress and see where you are in each recruitment process at a glance.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900">How It Works</h3>
              <p className="mt-4 text-xl text-gray-600">Get started in minutes</p>
            </div>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  1
                </div>
                <h4 className="text-lg font-semibold mb-2">Sign Up</h4>
                <p className="text-gray-600">Create your free account in seconds</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  2
                </div>
                <h4 className="text-lg font-semibold mb-2">Add Applications</h4>
                <p className="text-gray-600">Track each job you apply to</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  3
                </div>
                <h4 className="text-lg font-semibold mb-2">Set Reminders</h4>
                <p className="text-gray-600">Never miss important follow-ups</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                  4
                </div>
                <h4 className="text-lg font-semibold mb-2">Land Your Dream Job</h4>
                <p className="text-gray-600">Stay organized and succeed</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              Ready to Organize Your Job Search?
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of job seekers who are tracking their applications successfully
            </p>
            {!user && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-blue-600 bg-white rounded-full hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
              >
                Get Started for Free
                <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <p>
                Developed with an AI stack by{' '}
                <a 
                  href="https://www.linkedin.com/in/talgurevich/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Tal Gurevich
                </a>
              </p>
              <p className="mt-2 text-sm">
                &copy; 2025 All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default HomePage;