import React, { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import AuthDialog from '@/components/auth/AuthDialog';
import { Check, Upload, Palette, Download, Star, Users, Clock, Shield, X, FileText, MousePointer } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-inter">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="text-sm text-gray-600 mb-4">Trusted by top design studios</div>
          <h1 className="text-5xl md:text-7xl font-domine mb-6 leading-tight">
            Organize, Share & Deliver Logos
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Say goodbye to the hassle of organizing your client logos. Upload once, and get instant access to all formats, colors, and assets in one beautifully organized space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            {user ? (
              <Link to="/upload">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-sm font-medium font-inter">
                  Start Organizing
                </Button>
              </Link>
            ) : (
              <AuthDialog>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-sm font-medium font-inter">
                  Get Started Free
                </Button>
              </AuthDialog>
            )}
            <Button variant="outline" size="lg" className="px-8 py-4 text-sm font-medium font-inter border-2">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Pain */}
            <div className="bg-red-50 rounded-2xl p-12">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">😖</span>
                <h2 className="text-2xl font-domine">Pain:</h2>
              </div>
              <p className="text-lg font-inter text-gray-800 leading-relaxed">
                Logo files everywhere. No structure.<br />
                No consistency.
              </p>
            </div>

            {/* Solution */}
            <div className="bg-green-50 rounded-2xl p-12">
              <div className="flex items-center mb-6">
                <span className="text-2xl mr-3">✅</span>
                <h2 className="text-2xl font-domine">Solution:</h2>
              </div>
              <p className="text-lg font-inter text-gray-800 leading-relaxed">
                One place for every brand asset: from SVG to social-ready PNGs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-domine mb-6">Everything you need in one place</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Upload your logo once and get instant access to all formats, colors, fonts, and additional information organized beautifully.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
            <Card className="text-center p-8">
              <CardHeader>
                <MousePointer className="w-12 h-12 text-black mb-4 mx-auto" strokeWidth={1} />
                <CardTitle className="font-domine text-2xl">Drag & Drop Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Simply drag your logo files into LogoDrop and watch the magic happen. Instant upload with automatic processing.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardHeader>
                <Palette className="w-12 h-12 text-black mb-4 mx-auto" strokeWidth={1} />
                <CardTitle className="font-domine text-2xl">Fonts, Colors, Notes all in one panel</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Automatic color extraction, font identification, and space for all your brand notes in one organized sidebar.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-8">
              <CardHeader>
                <FileText className="w-12 h-12 text-black mb-4 mx-auto" strokeWidth={1} />
                <CardTitle className="font-domine text-2xl">Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base leading-relaxed">
                  Store client details, project notes, and external links. Everything you need to know about each logo in one place.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            {user ? (
              <Link to="/upload">
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-sm font-medium font-inter">
                  Lets LogoDrop it!
                </Button>
              </Link>
            ) : (
              <AuthDialog>
                <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-12 py-4 text-sm font-medium font-inter">
                  Lets LogoDrop it!
                </Button>
              </AuthDialog>
            )}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-domine mb-4">Simple Pricing, Powerful Features</h2>
            <p className="text-xl text-gray-600 mb-8">Simple, transparent pricing that grows with you. Try any plan free for 30 days.</p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-gray-100 rounded-full p-1 mb-12">
              <button
                onClick={() => setIsAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-medium font-inter transition-colors ${
                  !isAnnual ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Monthly billing
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-medium font-inter transition-colors ${
                  isAnnual ? 'bg-black text-white shadow-sm' : 'text-gray-600'
                }`}
              >
                Annual billing
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border-2 border-gray-200">
              <CardHeader className="text-left">
                <CardTitle className="font-domine text-xl">Free plan</CardTitle>
                <div className="text-4xl font-bold">
                  $0<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription>per member / month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Target: Students, Freelance designers.</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Features: Up to 5 logos, 50MB total storage, standard sharing.</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <X className="w-4 h-4 text-red-500" />
                    <span className="font-medium">No shareable link</span>
                  </div>
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  Limitations: Includes "Powered by myLogo" branding on the share page.
                </div>

                <AuthDialog>
                  <Button className="w-full text-sm font-medium font-inter" variant="outline">Sign up</Button>
                </AuthDialog>
              </CardContent>
            </Card>

            {/* Studio Plan */}
            <Card className="relative border-2 border-blue-600">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">Recommended</Badge>
              </div>
              <CardHeader className="text-left">
                <CardTitle className="font-domine text-xl">Studio plan</CardTitle>
                <div className="text-4xl font-bold">
                  ${isAnnual ? '10' : '12'}<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription>per member / month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Target: Design Studios, individual professionals.</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Features: Up to 100 logos, 5GB total storage, no branding on the share page, ability to add a custom domain for sharing (e.g., share.yourdomain.com).</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Shareable project links for clients</span>
                  </div>
                </div>

                <div className="mb-8">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Remove "Powered by myLogo"</span>
                  </div>
                </div>

                <AuthDialog>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm font-medium font-inter">Get started</Button>
                </AuthDialog>
              </CardContent>
            </Card>

            {/* Agency Plan */}
            <Card className="relative border-2 border-gray-200">
              <CardHeader className="text-left">
                <CardTitle className="font-domine text-xl">Agency plan</CardTitle>
                <div className="text-4xl font-bold">
                  ${isAnnual ? '29' : '35'}<span className="text-lg font-normal text-gray-600">/month</span>
                </div>
                <CardDescription>per member / month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">Unlimited logos</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">20GB total storage</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">all Pro features</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">analytics on share page views/ downloads</span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="font-medium">email support</span>
                  </div>
                </div>

                <Button className="w-full text-sm font-medium font-inter" variant="outline">Get started</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-domine mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about LogoDrop</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left font-medium">How does LogoDrop organize my logos?</AccordionTrigger>
                <AccordionContent>
                  LogoDrop automatically extracts colors, identifies fonts, and creates an organized profile for each logo you upload. You can add client information, project notes, and external links to keep everything in one place.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left font-medium">What file formats can I upload and export?</AccordionTrigger>
                <AccordionContent>
                  You can upload SVG, PNG, PDF, JPG, and AI files. LogoDrop can convert and export to any format you need, including optimized sizes for social media, web, and print.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left font-medium">Can I share logos with clients?</AccordionTrigger>
                <AccordionContent>
                  Yes! LogoDrop provides secure sharing links and client collaboration tools. Studio and Agency plans include advanced sharing features and white-label client portals.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left font-medium">Is my data secure?</AccordionTrigger>
                <AccordionContent>
                  Absolutely. We use enterprise-grade security with end-to-end encryption. Your logos and client data are stored securely and you maintain full control over your files.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left font-medium">Can I cancel anytime?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can cancel your subscription at any time. We also offer a 30-day money-back guarantee if you're not completely satisfied with LogoDrop.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-domine mb-4">Ready to organize your logo chaos?</h2>
          <p className="text-xl mb-8 text-gray-600">Join hundreds of designers who have streamlined their workflow with LogoDrop</p>
          {user ? (
            <Link to="/upload">
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-sm font-medium font-inter">
                Start Organizing Now
              </Button>
            </Link>
          ) : (
            <AuthDialog>
              <Button size="lg" className="bg-black text-white hover:bg-gray-800 px-8 py-4 text-sm font-medium font-inter">
                Get Started Free
              </Button>
            </AuthDialog>
          )}
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;
