import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Brain, 
  Zap, 
  Rocket,
  Sparkles,
  ArrowRight,
  Play,
  Database,
  Shield,
  Globe,
  Users,
  FileText,
  Calendar,
  MessageSquare,
  Award,
  TrendingUp
} from 'lucide-react';

export const FuturisticLandingPage: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // Create floating geometric shapes
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const meshes: THREE.Mesh[] = [];
    
    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
      const geometry = new THREE.IcosahedronGeometry(Math.random() * 0.5 + 0.2, 1);
      const material = new THREE.MeshPhongMaterial({
        color: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.5),
        emissive: new THREE.Color().setHSL(0.6 + Math.random() * 0.2, 0.7, 0.2),
        shininess: 100,
        opacity: 0.8,
        transparent: true
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (Math.random() - 0.5) * 10;
      mesh.position.y = (Math.random() - 0.5) * 10;
      mesh.position.z = (Math.random() - 0.5) * 10;
      
      geometries.push(geometry);
      materials.push(material);
      meshes.push(mesh);
      scene.add(mesh);
    }
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0x404040, 0.5);
    scene.add(ambientLight);
    
    const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);
    
    camera.position.z = 5;
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      meshes.forEach((mesh, index) => {
        mesh.rotation.x += 0.001 * (index % 3 + 1);
        mesh.rotation.y += 0.002 * (index % 2 + 1);
        mesh.position.y += Math.sin(Date.now() * 0.001 + index) * 0.002;
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      geometries.forEach(geometry => geometry.dispose());
      materials.forEach(material => material.dispose());
      meshes.forEach(mesh => scene.remove(mesh));
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-blue-950 to-black text-white overflow-hidden relative">
      {/* 3D Canvas Background */}
      <canvas 
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
      />
      
      {/* Gradient Overlay */}
      <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-black/60 via-blue-900/20 to-black/60 pointer-events-none z-10" />
      
      {/* Floating Particles */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-20">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-50 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center z-30">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-6xl mx-auto">
            {/* Animated Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-blue-500/30 mb-8 animate-float">
              <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
              <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Next-Gen Dissertation Management
              </span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent animate-gradient">
                PG Dissertation
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-600 bg-clip-text text-transparent animate-gradient-delayed">
                Management System
              </span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your academic journey with AI-powered dissertation management, 
              real-time collaboration, and intelligent workflow automation.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button 
                onClick={() => window.location.hash = '#login'}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <span className="relative z-10 flex items-center justify-center">
                  <Rocket className="w-5 h-5 mr-2" />
                  Launch Your Journey
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <button 
                onClick={() => window.location.hash = '#login'}
                className="group px-8 py-4 bg-blue-500/10 backdrop-blur-lg border border-blue-500/20 rounded-full font-semibold text-lg hover:bg-blue-500/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20"
              >
                <Play className="w-5 h-5 mr-2 inline" />
                Watch Demo
              </button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  95%
                </div>
                <div className="text-gray-400">Success Rate</div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  500+
                </div>
                <div className="text-gray-400">Active Students</div>
              </div>
              <div className="glass-card p-6 rounded-2xl">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                  24/7
                </div>
                <div className="text-gray-400">AI Support</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Floating 3D Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full opacity-20 blur-xl animate-float" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full opacity-20 blur-xl animate-float-delayed" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full opacity-20 blur-xl animate-float" />
      </section>
      
      {/* About Section */}
      <section className="relative py-20 z-30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Revolutionary Approach
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Experience the future of academic research management with cutting-edge technology 
                and intelligent automation.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Brain className="w-8 h-8" />,
                  title: "AI-Powered Insights",
                  description: "Get intelligent recommendations for topic selection, research methodology, and publication strategies."
                },
                {
                  icon: <Zap className="w-8 h-8" />,
                  title: "Lightning Fast",
                  description: "Process approvals, track progress, and collaborate with your team in real-time."
                },
                {
                  icon: <Shield className="w-8 h-8" />,
                  title: "Secure & Private",
                  description: "Your research data is protected with enterprise-grade security and privacy controls."
                },
                {
                  icon: <Users className="w-8 h-8" />,
                  title: "Smart Collaboration",
                  description: "Connect with supervisors, peers, and experts through intelligent matching systems."
                },
                {
                  icon: <Database className="w-8 h-8" />,
                  title: "Data Analytics",
                  description: "Track your progress with comprehensive analytics and performance insights."
                },
                {
                  icon: <Globe className="w-8 h-8" />,
                  title: "Global Access",
                  description: "Access your dissertation work from anywhere with our cloud-based platform."
                }
              ].map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card p-8 rounded-3xl hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20"
                  style={{
                    transform: `translateY(${scrollY * 0.05 * (index % 2 === 0 ? 1 : -1)}px)`
                  }}
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-white">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="relative py-20 z-30">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Advanced Features
                </span>
              </h2>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Everything you need to manage your dissertation from start to finish.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                {[
                  {
                    icon: <FileText className="w-6 h-6" />,
                    title: "Smart Topic Management",
                    description: "AI-assisted topic selection with real-time approval tracking and peer review system."
                  },
                  {
                    icon: <Calendar className="w-6 h-6" />,
                    title: "Intelligent Timeline",
                    description: "Automated milestone tracking with smart deadline management and progress visualization."
                  },
                  {
                    icon: <MessageSquare className="w-6 h-6" />,
                    title: "Seamless Communication",
                    description: "Integrated messaging system with video conferencing and collaborative document editing."
                  },
                  {
                    icon: <Award className="w-6 h-6" />,
                    title: "Publication Hub",
                    description: "One-click submission to academic journals with plagiarism checking and format validation."
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform">
                      {item.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                      <p className="text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                <div className="glass-card p-8 rounded-3xl">
                  <img
                    src="https://picsum.photos/seed/futuristic-dissertation-dashboard/600/400.jpg"
                    alt="Futuristic Dashboard Interface"
                    className="w-full h-auto rounded-2xl"
                  />
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full animate-pulse" />
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full animate-pulse-delayed" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="relative py-20 z-30">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="glass-card p-12 rounded-3xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                <span className="bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  Ready to Transform Your Research?
                </span>
              </h2>
              <p className="text-lg text-gray-300 mb-8">
                Join hundreds of students who are already accelerating their dissertation journey with our platform.
              </p>
              <button 
                onClick={() => window.location.hash = '#login'}
                className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full font-semibold text-lg hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/50"
              >
                <TrendingUp className="w-5 h-5 mr-2 inline" />
                Start Your Journey Now
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>
      
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes gradient-delayed {
          0%, 100% { background-position: 100% 50%; }
          50% { background-position: 0% 50%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-float-delayed {
          animation: float-delayed 3s ease-in-out infinite;
          animation-delay: 1s;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-gradient-delayed {
          background-size: 200% 200%;
          animation: gradient-delayed 3s ease infinite;
        }
        
        .glass-card {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        
        .animate-pulse-delayed {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};
