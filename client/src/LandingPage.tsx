import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  Star,
  ArrowRight,
  BookOpen,
  Target,
  Zap,
  Sparkles
} from 'lucide-react';

// Animation variants for different components
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
};

const fadeInScale = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 }
};

const slideInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
};

const slideInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
};

const bounceIn = {
  hidden: { opacity: 0, scale: 0.3 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1
    }
  }
};

export default function LandingPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHoveringFeature, setIsHoveringFeature] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      if (!isHoveringFeature) {
        setActiveFeature(prev => (prev + 1) % 3);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isHoveringFeature]); // watch for hover changes

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGetStarted = () => {
    navigate('/register');
  };


  const features = [
    {
      icon: <Clock size={28} />,
      title: "Pomodoro Timer",
      description: "Stay focused with the Pomodoro technique. Work in short bursts with timed breaks to boost productivity.",
      gradient: "from-red-500 to-pink-500",
      bgGradient: "from-red-500/10 to-pink-500/10",
      status: "25:00 - Ready to start"
    },
    {
      icon: <Users size={28} />,
      title: "Smart Matching",
      description: "Find the perfect study buddy based on your major, modules, goals, and schedule. Stay motivated together.",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-500/10 to-cyan-500/10",
      status: "12 peers online now"
    },
    {
      icon: <TrendingUp size={28} />,
      title: "Progress Tracking",
      description: "Track your progress and climb the leaderboard as you complete tasks and build good study habits.",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-500/10 to-emerald-500/10",
      status: "Weekly report ready"
    }
  ];

  const stats = [
    { icon: <Users size={20} />, number: "10K+", label: "Active Students", color: "from-indigo-500 to-purple-500" },
    { icon: <CheckCircle size={20} />, number: "50K+", label: "Study Sessions", color: "from-green-500 to-emerald-500" },
    { icon: <Star size={20} />, number: "95%", label: "Success Rate", color: "from-amber-500 to-orange-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 font-sans overflow-hidden relative">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"
          style={{
            left: mousePosition.x / 10,
            top: mousePosition.y / 10,
            transform: 'translate(-50%, -50%)'
          }}
        />
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/10 to-indigo-400/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-2xl animate-ping" style={{ animationDuration: '6s' }} />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <div 
            className={`flex justify-between items-center transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}
          >
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                <BookOpen className="text-white" size={20} />
              </div>
              <h2 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                StudyBuddy
              </h2>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer px-6 py-2 bg-white/60 backdrop-blur-xl text-indigo-600 rounded-xl border border-white/20 hover:bg-white/80 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            {/* Badge */}
            <div 
              className={`inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 mb-8 transform transition-all duration-1000 delay-200 ${
                isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-90'
              }`}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-600 font-medium">Built by NUS Students, for NUS Students</span>
              <Sparkles className="text-indigo-500 animate-pulse" size={14} />
            </div>
            
            {/* Main Heading */}
            <div 
              className={`transform transition-all duration-1000 delay-400 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">Track</span>{' '}
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">your</span>{' '}
                <span className="inline-block hover:scale-105 transition-transform duration-300 cursor-default">goals.</span>
                <br />
                <span className="text-4xl md:text-6xl inline-block hover:scale-105 transition-transform duration-300 cursor-default">Plan</span>{' '}
                <span className="text-4xl md:text-6xl inline-block hover:scale-105 transition-transform duration-300 cursor-default">smarter.</span>{' '}
                <span className="text-4xl md:text-6xl inline-block hover:scale-105 transition-transform duration-300 cursor-default">Study</span>{' '}
                <span className="text-4xl md:text-6xl inline-block hover:scale-105 transition-transform duration-300 cursor-default">better.</span>
              </h1>
            </div>
            
            {/* Description */}
            <div 
              className={`transform transition-all duration-1000 delay-600 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
                StudyBuddy helps you connect with like-minded peers to study together, stay accountable, and boost your academic performance.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div 
              className={`flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 transform transition-all duration-1000 delay-800 ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
            >
              <button
                onClick={handleGetStarted}
                className="group cursor-pointer relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl hover:shadow-indigo-500/25 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 font-semibold text-lg overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="relative z-10 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300" size={20} />
                <div className="absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 origin-center" />
              </button>
              <button className="cursor-pointer group flex items-center gap-3 px-8 py-4 bg-white/60 backdrop-blur-xl text-gray-700 rounded-2xl border border-white/20 hover:bg-white/80 hover:scale-105 hover:shadow-lg transition-all duration-300 font-medium text-lg">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse group-hover:animate-bounce" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Animated Stats Grid */}
            <div className="relative max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`transform transition-all duration-1000 ${
                      isVisible 
                        ? 'translate-y-0 opacity-100' 
                        : 'translate-y-20 opacity-0'
                    }`}
                    style={{ transitionDelay: `${1000 + index * 200}ms` }}
                  >
                    <div className="group bg-white/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/20 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105 cursor-pointer">
                      <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} text-white mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                        {React.cloneElement(stat.icon, { 
                          className: "group-hover:animate-pulse" 
                        })}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                        {stat.number}
                      </div>
                      <div className="text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                        {stat.label}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 to-purple-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div 
            className={`text-center mb-16 transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '1400ms' }}
          >
            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 mb-8 hover:scale-105 transition-transform duration-300">
              <Zap className="text-indigo-600 animate-pulse" size={16} />
              <span className="text-sm text-gray-600 font-medium">Powerful Features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your study habits with our comprehensive suite of productivity tools
            </p>
          </div>

          {/* Features Grid */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {features.map((feature, index) => (
    <div
      key={index}
      className={`transform transition-all duration-700 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
      }`}
      style={{ transitionDelay: `${1600 + index * 200}ms` }}
    >
      <div 
        className={`relative group bg-white/80 backdrop-blur-xl rounded-2xl p-8 shadow-lg border border-white/20 transition-all duration-500 transform cursor-pointer overflow-hidden
          ${activeFeature === index ? 'ring-2 ring-indigo-500 shadow-indigo-500/20 scale-105' : ''}
        `}
        onMouseEnter={() => {
          setActiveFeature(index);
          setIsHoveringFeature(true); // Stop cycling
        }}
        onMouseLeave={() => {
          setIsHoveringFeature(false); // Resume cycling
        }}
      >
        {/* Remove breathing background */}
        <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

        {/* Floating Icon */}
        <div className={`relative inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} text-white mb-6 group-hover:scale-125 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
          {React.cloneElement(feature.icon, {
            className: "" // removed animate-pulse
          })}
          <div className="absolute inset-0 bg-white/20 rounded-2xl scale-0 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <h3 className="relative text-2xl font-bold text-gray-900 mb-4 group-hover:text-indigo-600 transition-colors duration-300">
          {feature.title}
        </h3>

        <p className="relative text-gray-600 mb-6 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
          {feature.description}
        </p>

        <div className="relative flex items-center justify-between">
          <span className={`text-xs font-medium px-3 py-2 rounded-full bg-gradient-to-r ${feature.bgGradient} text-gray-700 group-hover:scale-105 transition-transform duration-300`}>
            {feature.status}
          </span>
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
            <ArrowRight className="text-indigo-600" size={20} />
          </div>
        </div>

                  {/* Animated Border */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-3 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <div 
            className={`transform transition-all duration-1000 ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}
            style={{ transitionDelay: '2200ms' }}
          >
            <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl p-12 text-white shadow-2xl overflow-hidden group hover:scale-105 transition-transform duration-500">
              {/* Animated Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent animate-pulse" />
                <div style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  width: '100%',
                  height: '100%'
                }} />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute top-4 right-4 animate-bounce" style={{ animationDelay: '1s', animationDuration: '3s' }}>
                <Star className="text-white/30" size={24} />
              </div>
              <div className="absolute bottom-4 left-4 animate-pulse" style={{ animationDelay: '2s' }}>
                <Target className="text-white/30" size={20} />
              </div>
              
              <div className="relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8 hover:scale-105 transition-transform duration-300">
                  <Target className="text-white animate-spin" size={16} style={{ animationDuration: '4s' }} />
                  <span className="text-sm text-white font-medium">Ready to Transform?</span>
                </div>
                
                <h3 className="text-4xl md:text-5xl font-bold mb-6 hover:scale-105 transition-transform duration-300 cursor-default">
                  Join thousands of successful students
                </h3>
                
                <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Start your journey today and unlock your full academic potential with personalized study partnerships and powerful productivity tools.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                  <button
                    onClick={handleGetStarted}
                    className="group cursor-pointer relative flex items-center justify-center gap-3 px-10 py-4 bg-white text-indigo-600 rounded-2xl hover:bg-gray-50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-110 hover:shadow-2xl font-bold text-lg overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative z-10">Start Your Journey</span>
                    <ArrowRight className="relative z-10 group-hover:translate-x-2 group-hover:scale-125 transition-all duration-300" size={20} />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  <button className="group cursor-pointer flex items-center justify-center gap-3 px-10 py-4 bg-white/20 backdrop-blur-sm text-white rounded-2xl border border-white/30 hover:bg-white/30 hover:scale-105 transition-all duration-300 font-medium text-lg">
                    <span>Learn More</span>
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse group-hover:animate-bounce" />
                  </button>
                </div>
                
                <p className="text-sm text-white/70 animate-pulse">
                  Free to start • No credit card required • Join 10,000+ students
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-white/20 bg-white/40 backdrop-blur-xl">
        <div 
          className={`max-w-7xl mx-auto text-center text-gray-600 transform transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '2400ms' }}
        >
          <div className="flex items-center justify-center gap-3 mb-4 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
              <BookOpen className="text-white" size={16} />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              StudyBuddy
            </span>
          </div>
          <p className="text-sm hover:text-gray-800 transition-colors duration-300">
            Built with ❤️ for NUS students • © 2025 StudyBuddy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}