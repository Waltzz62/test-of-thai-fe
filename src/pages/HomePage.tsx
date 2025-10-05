import { Link } from 'react-router-dom';
import { ChefHat, Clock, Users, Award } from 'lucide-react';

export function HomePage() {
  const features = [
    {
      icon: ChefHat,
      title: 'Authentic Thai Cuisine',
      description: 'Learn traditional Thai cooking techniques from experienced chefs',
    },
    {
      icon: Clock,
      title: 'Flexible Scheduling',
      description: 'Choose from various time slots that fit your schedule',
    },
    {
      icon: Users,
      title: 'Small Class Sizes',
      description: 'Intimate learning environment with personalized attention',
    },
    {
      icon: Award,
      title: 'All Skill Levels',
      description: 'From beginner to advanced, we have classes for everyone',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Taste of Thai
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-orange-100">
              Discover the authentic flavors of Thailand through hands-on cooking classes
            </p>
            <div className="space-x-4">
              <Link
                to="/classes"
                className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
              >
                Browse Classes
              </Link>
              <Link
                to="/register"
                className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our Classes?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the best Thai cooking education with our unique approach
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-orange-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Start Cooking?
          </h2>
          <p className="text-xl text-orange-100 mb-8">
            Join thousands of students who have mastered Thai cuisine with us
          </p>
          <div className="space-x-4">
            <Link
              to="/classes"
              className="inline-block bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors"
            >
              View All Classes
            </Link>
            <Link
              to="/apply-staff"
              className="inline-block border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-orange-600 transition-colors"
            >
              Become an Instructor
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}