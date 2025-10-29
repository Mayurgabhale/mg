<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Global Advertisementing | Instagram & Google Advertising</title>
    <meta name="description" content="Grow your brand on Instagram & Google with our premium advertising services. 60-day free trial available.">
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        :root {
            --primary: #4f46e5;
            --primary-dark: #4338ca;
            --secondary: #10b981;
            --dark: #1f2937;
            --light: #f9fafb;
        }
        
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .service-card {
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .service-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .testimonial-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .featured-ad-card {
            transition: all 0.3s ease;
        }
        
        .featured-ad-card:hover {
            transform: scale(1.03);
        }
        
        .nav-link {
            position: relative;
        }
        
        .nav-link::after {
            content: '';
            position: absolute;
            width: 0;
            height: 2px;
            bottom: -5px;
            left: 0;
            background-color: var(--primary);
            transition: width 0.3s ease;
        }
        
        .nav-link:hover::after {
            width: 100%;
        }
    </style>
</head>
<body class="bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="container mx-auto px-4 py-3 flex justify-between items-center">
            <div class="flex items-center space-x-2">
                <div class="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                    <span class="text-white font-bold">GA</span>
                </div>
                <span class="text-xl font-bold text-gray-800">Global Advertisementing</span>
            </div>
            
            <div class="hidden md:flex space-x-8">
                <a href="#" class="nav-link text-gray-700 font-medium">Home</a>
                <a href="#" class="nav-link text-gray-700 font-medium">About</a>
                <a href="#" class="nav-link text-gray-700 font-medium">Services</a>
                <a href="#" class="nav-link text-gray-700 font-medium">Promotions</a>
                <a href="#" class="nav-link text-gray-700 font-medium">Contact</a>
            </div>
            
            <div class="flex items-center space-x-4">
                <button class="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition duration-300">
                    Get Started
                </button>
                <button class="md:hidden text-gray-700">
                    <i class="fas fa-bars text-xl"></i>
                </button>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="gradient-bg text-white py-20">
        <div class="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div class="md:w-1/2 mb-10 md:mb-0">
                <h1 class="text-4xl md:text-5xl font-bold mb-6">Grow Your Brand on Instagram & Google</h1>
                <p class="text-xl mb-8 opacity-90">Reach a global audience through our ad network — we connect your business to millions via Instagram promotions and Google search visibility.</p>
                <div class="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                    <button class="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                        <i class="fas fa-rocket mr-2"></i> Start 60-Day Free Service
                    </button>
                    <button class="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition duration-300 flex items-center justify-center">
                        <i class="fas fa-globe mr-2"></i> View Featured Ads
                    </button>
                </div>
            </div>
            <div class="md:w-1/2 flex justify-center">
                <div class="relative w-full max-w-md">
                    <div class="absolute -top-10 -left-10 w-64 h-64 bg-white bg-opacity-10 rounded-full"></div>
                    <div class="absolute -bottom-10 -right-10 w-64 h-64 bg-white bg-opacity-10 rounded-full"></div>
                    <div class="relative bg-white rounded-2xl shadow-2xl p-6 text-gray-800">
                        <div class="flex justify-between items-center mb-4">
                            <div class="flex space-x-2">
                                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div class="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <span class="text-sm font-medium">Ad Performance Dashboard</span>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="font-medium">Instagram Reach</span>
                                <span class="text-green-600 font-bold">+42%</span>
                            </div>
                            <div class="w-full bg-gray-300 rounded-full h-2">
                                <div class="bg-green-500 h-2 rounded-full" style="width: 75%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4 mb-4">
                            <div class="flex justify-between mb-2">
                                <span class="font-medium">Google Impressions</span>
                                <span class="text-green-600 font-bold">+68%</span>
                            </div>
                            <div class="w-full bg-gray-300 rounded-full h-2">
                                <div class="bg-blue-500 h-2 rounded-full" style="width: 85%"></div>
                            </div>
                        </div>
                        <div class="bg-gray-100 rounded-lg p-4">
                            <div class="flex justify-between mb-2">
                                <span class="font-medium">Engagement Rate</span>
                                <span class="text-green-600 font-bold">+35%</span>
                            </div>
                            <div class="w-full bg-gray-300 rounded-full h-2">
                                <div class="bg-purple-500 h-2 rounded-full" style="width: 65%"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- About Preview Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Who We Are</h2>
                <div class="w-20 h-1 bg-indigo-600 mx-auto"></div>
            </div>
            
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-1/2 mb-10 md:mb-0">
                    <p class="text-lg text-gray-600 mb-6">
                        Global Advertisementing is a digital marketing agency helping creators and businesses grow through social media promotions and Google visibility.
                    </p>
                    <p class="text-lg text-gray-600 mb-8">
                        We specialize in Instagram Ads, Brand Collaborations, and Google-indexed promotions that make your content discoverable worldwide.
                    </p>
                    <button class="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-300 flex items-center">
                        Learn More <i class="fas fa-arrow-right ml-2"></i>
                    </button>
                </div>
                <div class="md:w-1/2 flex justify-center">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="bg-indigo-100 p-6 rounded-xl service-card">
                            <div class="w-12 h-12 bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
                                <i class="fas fa-chart-line text-white text-xl"></i>
                            </div>
                            <h3 class="font-bold text-gray-800 mb-2">Data-Driven Strategy</h3>
                            <p class="text-gray-600">We analyze performance metrics to optimize your campaigns.</p>
                        </div>
                        <div class="bg-green-100 p-6 rounded-xl service-card">
                            <div class="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                                <i class="fas fa-users text-white text-xl"></i>
                            </div>
                            <h3 class="font-bold text-gray-800 mb-2">Global Audience</h3>
                            <p class="text-gray-600">Reach customers worldwide across multiple platforms.</p>
                        </div>
                        <div class="bg-purple-100 p-6 rounded-xl service-card">
                            <div class="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
                                <i class="fas fa-search text-white text-xl"></i>
                            </div>
                            <h3 class="font-bold text-gray-800 mb-2">Google Visibility</h3>
                            <p class="text-gray-600">Get your content indexed and discovered on Google.</p>
                        </div>
                        <div class="bg-yellow-100 p-6 rounded-xl service-card">
                            <div class="w-12 h-12 bg-yellow-600 rounded-lg flex items-center justify-center mb-4">
                                <i class="fas fa-camera text-white text-xl"></i>
                            </div>
                            <h3 class="font-bold text-gray-800 mb-2">Creative Content</h3>
                            <p class="text-gray-600">Eye-catching visuals designed to convert viewers.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">Everything You Need to Advertise Globally</h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">Our comprehensive suite of services helps your brand reach new heights across all digital platforms.</p>
                <div class="w-20 h-1 bg-indigo-600 mx-auto mt-4"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-bullhorn text-indigo-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Instagram Ads & Reels Promotion</h3>
                    <p class="text-gray-600 mb-4">Boost engagement, reach new followers, and promote your products on trending reels.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-search text-blue-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Google Advertising</h3>
                    <p class="text-gray-600 mb-4">Run search and display campaigns that make your brand appear on Google instantly.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-handshake text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Brand Collaborations</h3>
                    <p class="text-gray-600 mb-4">Connect with verified influencers and partner brands to expand your reach.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-palette text-purple-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Creative Content Design</h3>
                    <p class="text-gray-600 mb-4">Custom visuals, reels, and marketing materials designed to convert.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-chart-bar text-red-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Analytics & Growth Tracking</h3>
                    <p class="text-gray-600 mb-4">Get real-time insights into your ad performance with detailed analytics.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 service-card">
                    <div class="w-14 h-14 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                        <i class="fas fa-rocket text-yellow-600 text-2xl"></i>
                    </div>
                    <h3 class="text-xl font-bold text-gray-800 mb-3">Strategy Consultation</h3>
                    <p class="text-gray-600 mb-4">Personalized marketing strategies tailored to your business goals.</p>
                    <a href="#" class="text-indigo-600 font-medium flex items-center">
                        Learn more <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                </div>
            </div>
        </div>
    </section>

    <!-- 60-Day Free Offer Section -->
    <section class="py-16 bg-indigo-600 text-white">
        <div class="container mx-auto px-4">
            <div class="flex flex-col md:flex-row items-center">
                <div class="md:w-2/3 mb-10 md:mb-0">
                    <h2 class="text-3xl font-bold mb-4">🎯 Start Free — Experience Real Growth</h2>
                    <p class="text-xl mb-6 opacity-90">
                        We believe in results first. That's why your first 60 days of advertising are completely free. No contracts. No risks — just pure visibility and engagement.
                    </p>
                    <div class="flex flex-wrap gap-4 mb-6">
                        <div class="flex items-center">
                            <i class="fas fa-check-circle text-green-300 mr-2"></i>
                            <span>No credit card required</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-check-circle text-green-300 mr-2"></i>
                            <span>Cancel anytime</span>
                        </div>
                        <div class="flex items-center">
                            <i class="fas fa-check-circle text-green-300 mr-2"></i>
                            <span>Full features included</span>
                        </div>
                    </div>
                    <button class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 flex items-center">
                        <i class="fas fa-gift mr-2"></i> Claim 60 Days Free
                    </button>
                </div>
                <div class="md:w-1/3 flex justify-center">
                    <div class="relative">
                        <div class="w-64 h-64 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                            <div class="w-48 h-48 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                                <div class="w-32 h-32 bg-white bg-opacity-10 rounded-full flex items-center justify-center">
                                    <div class="text-center">
                                        <div class="text-3xl font-bold">60</div>
                                        <div class="text-lg">Days Free</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Featured Promotions Section -->
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">🌍 See How We Promote Brands Globally</h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">We feature our clients' ads and promotions on our website — giving them additional reach through Google Search indexing.</p>
                <div class="w-20 h-1 bg-indigo-600 mx-auto mt-4"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                <div class="rounded-xl overflow-hidden shadow-lg featured-ad-card">
                    <div class="h-48 bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                        <span class="text-white text-xl font-bold">BrandX Campaign</span>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-gray-800">@brandx</h3>
                            <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Featured</span>
                        </div>
                        <p class="text-gray-600 mb-4">Fashion brand that increased engagement by 150% in 30 days.</p>
                        <div class="flex justify-between items-center">
                            <a href="#" class="text-indigo-600 font-medium flex items-center">
                                <i class="fab fa-instagram mr-2"></i> View
                            </a>
                            <span class="text-xs text-gray-500">Promoted by Global Advertisementing</span>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl overflow-hidden shadow-lg featured-ad-card">
                    <div class="h-48 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                        <span class="text-white text-xl font-bold">ShopTrendz</span>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-gray-800">@shoptrendz</h3>
                            <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Featured</span>
                        </div>
                        <p class="text-gray-600 mb-4">E-commerce store that doubled sales with Google Ads.</p>
                        <div class="flex justify-between items-center">
                            <a href="#" class="text-indigo-600 font-medium flex items-center">
                                <i class="fab fa-instagram mr-2"></i> View
                            </a>
                            <span class="text-xs text-gray-500">Promoted by Global Advertisementing</span>
                        </div>
                    </div>
                </div>
                
                <div class="rounded-xl overflow-hidden shadow-lg featured-ad-card">
                    <div class="h-48 bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                        <span class="text-white text-xl font-bold">TechGadgets</span>
                    </div>
                    <div class="p-6">
                        <div class="flex justify-between items-center mb-4">
                            <h3 class="font-bold text-gray-800">@techgadgets</h3>
                            <span class="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Featured</span>
                        </div>
                        <p class="text-gray-600 mb-4">Tech review channel that gained 50K followers in 2 months.</p>
                        <div class="flex justify-between items-center">
                            <a href="#" class="text-indigo-600 font-medium flex items-center">
                                <i class="fab fa-instagram mr-2"></i> View
                            </a>
                            <span class="text-xs text-gray-500">Promoted by Global Advertisementing</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="text-center">
                <button class="bg-indigo-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition duration-300 flex items-center mx-auto">
                    <i class="fas fa-eye mr-2"></i> View Featured Advertisements
                </button>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-16 bg-gray-50">
        <div class="container mx-auto px-4">
            <div class="text-center mb-12">
                <h2 class="text-3xl font-bold text-gray-800 mb-4">What Our Clients Say</h2>
                <p class="text-lg text-gray-600 max-w-2xl mx-auto">Hear from businesses that have transformed their digital presence with our advertising solutions.</p>
                <div class="w-20 h-1 bg-indigo-600 mx-auto mt-4"></div>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="bg-white rounded-xl shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fas fa-user text-indigo-600"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">@brandx</h3>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 italic">"Our Instagram engagement doubled within 30 days! The targeted ads reached exactly the audience we wanted, and the creative content team delivered stunning visuals that perfectly represented our brand."</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fas fa-user text-green-600"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">@shoptrendz</h3>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 italic">"We appeared on Google within weeks of joining! The SEO optimization for our product pages was incredible, and our sales increased by 75% in the first two months. The 60-day free trial made it risk-free to try."</p>
                </div>
                
                <div class="bg-white rounded-xl shadow-md p-6 md:col-span-2">
                    <div class="flex items-center mb-4">
                        <div class="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                            <i class="fas fa-user text-purple-600"></i>
                        </div>
                        <div>
                            <h3 class="font-bold text-gray-800">@lifestylevibes</h3>
                            <div class="flex text-yellow-400">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600 italic">"The brand collaboration feature connected us with perfect influencer partners who genuinely loved our products. Our follower count grew by 200% in just 45 days, and the engagement on our posts is through the roof. Global Advertisementing truly understands how to create authentic connections between brands and audiences."</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div class="container mx-auto px-4 text-center">
            <h2 class="text-3xl font-bold mb-6">Ready to Grow Globally?</h2>
            <p class="text-xl mb-8 max-w-2xl mx-auto">Join thousands of brands that have transformed their digital presence with our premium advertising solutions.</p>
            <div class="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                <button class="bg-white text-indigo-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-100 transition duration-300 flex items-center justify-center">
                    <i class="fas fa-rocket mr-2"></i> Get Started Now
                </button>
                <button class="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white hover:bg-opacity-10 transition duration-300 flex items-center justify-center">
                    <i class="fas fa-comments mr-2"></i> Contact Us
                </button>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-800 text-white py-12">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center space-x-2 mb-4">
                        <div class="w-10 h-10 rounded-full gradient-bg flex items-center justify-center">
                            <span class="text-white font-bold">GA</span>
                        </div>
                        <span class="text-xl font-bold">Global Advertisementing</span>
                    </div>
                    <p class="text-gray-400 mb-4">Connecting brands to global audiences through Instagram and Google advertising.</p>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300">
                            <i class="fab fa-instagram text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300">
                            <i class="fab fa-facebook text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300">
                            <i class="fab fa-twitter text-xl"></i>
                        </a>
                        <a href="#" class="text-gray-400 hover:text-white transition duration-300">
                            <i class="fab fa-linkedin text-xl"></i>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h3 class="font-bold text-lg mb-4">Quick Links</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Home</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">About Us</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Services</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Promotions</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Contact</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-lg mb-4">Services</h3>
                    <ul class="space-y-2">
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Instagram Ads</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Google Advertising</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Brand Collaborations</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Content Design</a></li>
                        <li><a href="#" class="text-gray-400 hover:text-white transition duration-300">Analytics</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 class="font-bold text-lg mb-4">Contact Info</h3>
                    <ul class="space-y-2">
                        <li class="flex items-center">
                            <i class="fas fa-envelope text-gray-400 mr-2"></i>
                            <span class="text-gray-400">contact@mayoai.tech</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fab fa-whatsapp text-gray-400 mr-2"></i>
                            <span class="text-gray-400">+1 (555) 123-4567</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fab fa-instagram text-gray-400 mr-2"></i>
                            <span class="text-gray-400">@global.advertisementing</span>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div class="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                <p class="text-gray-400 mb-4 md:mb-0">© 2025 Global Advertisementing | Powered by Mayoai.tech</p>
                <div class="flex space-x-6">
                    <a href="#" class="text-gray-400 hover:text-white transition duration-300">Privacy Policy</a>
                    <a href="#" class="text-gray-400 hover:text-white transition duration-300">Terms of Service</a>
                    <a href="#" class="text-gray-400 hover:text-white transition duration-300">Cookie Policy</a>
                </div>
            </div>
        </div>
    </footer>

    <script>
        // Simple JavaScript for interactive elements
        document.addEventListener('DOMContentLoaded', function() {
            // Add animation to service cards on scroll
            const observerOptions = {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            };
            
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, observerOptions);
            
            // Observe service cards
            const serviceCards = document.querySelectorAll('.service-card');
            serviceCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
            
            // Observe featured ad cards
            const featuredCards = document.querySelectorAll('.featured-ad-card');
            featuredCards.forEach(card => {
                card.style.opacity = 0;
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                observer.observe(card);
            });
        });
    </script>
</body>
</html>