import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Code, Globe, Server, Smartphone, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/">
            <img src="/kirknetlogo.png" alt="KirkNetworks Logo" className="h-12" />
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#services" className="text-gray-600 hover:text-blue-700 transition-colors">Services</a>
            <a href="#about" className="text-gray-600 hover:text-blue-700 transition-colors">About</a>
            <a href="#service-area" className="text-gray-600 hover:text-blue-700 transition-colors">Service Area</a>
            <Link to="/contact" className="text-gray-600 hover:text-blue-700 transition-colors">Contact</Link>
          </nav>
          <Button asChild className="hidden md:block bg-blue-700 hover:bg-blue-800 text-white">
            <Link to="/contact">Get a Quote</Link>
          </Button>
          {/* A mobile menu could be added here in the future if you'd like! */}
        </div>
      </header>

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <section className="relative text-center py-24 md:py-32 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-4">
              Your Trusted Technology Partner
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              KirkNetworks provides expert IT consultation, custom software solutions, and comprehensive development services to help your business thrive.
            </p>
            <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-lg">
              <Link to="/contact">Request a Free Consultation</Link>
            </Button>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20 md:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Our Core Services</h2>
                <p className="mt-4 text-lg text-gray-600">We offer a wide range of technology solutions.</p>
            </div>
            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link to="/services/it-consultation" className="block hover:shadow-xl transition-shadow rounded-lg">
                <Card className="text-center shadow-lg h-full">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                      <Server className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">IT Consultation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Strategic IT guidance to optimize your infrastructure and operations.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/services/software-development" className="block hover:shadow-xl transition-shadow rounded-lg">
                <Card className="text-center shadow-lg h-full">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                      <Code className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">Software Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Custom software tailored to your unique business needs and goals.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/services/web-development" className="block hover:shadow-xl transition-shadow rounded-lg">
                <Card className="text-center shadow-lg h-full">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                      <Globe className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">Web Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Modern, responsive websites that engage your audience.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/services/app-development" className="block hover:shadow-xl transition-shadow rounded-lg">
                <Card className="text-center shadow-lg h-full">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                      <Smartphone className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">App Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Intuitive mobile applications for both iOS and Android platforms.</p>
                  </CardContent>
                </Card>
              </Link>
              <Link to="/services/msp" className="block hover:shadow-xl transition-shadow rounded-lg">
                <Card className="text-center shadow-lg h-full">
                  <CardHeader>
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
                      <ShieldCheck className="h-8 w-8 text-blue-700" />
                    </div>
                    <CardTitle className="mt-4 text-xl font-semibold">Managed Services (MSP)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">Proactive IT management and support to keep your systems running smoothly.</p>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">About KirkNetworks, LLC</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Based in Watertown, SD, KirkNetworks, LLC is dedicated to providing top-tier technology services. We partner with businesses to drive growth and efficiency through innovative and reliable solutions. Our commitment is to your success.
                </p>
            </div>
        </section>

        {/* Service Area Section */}
        <section id="service-area" className="py-20 md:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Proudly Serving Our Region</h2>
                <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                    Based in Watertown, we provide on-site and remote IT services to communities throughout Eastern South Dakota and neighboring areas.
                </p>
                <div className="mt-8 text-gray-700 max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">South Dakota</h3>
                        <p>Watertown, Sioux Falls, Brookings, Aberdeen, Huron, Mitchell, Milbank, Sisseton, Clark</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">Minnesota</h3>
                        <p>Marshall, Montevideo, Ortonville, Canby</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-gray-800">North Dakota</h3>
                        <p>Fargo, Wahpeton</p>
                    </div>
                </div>
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-20 md:py-24 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to start a project?</h2>
                <p className="mt-4 text-lg text-gray-600 mb-8">Let's talk about how we can help you achieve your goals.</p>
                <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-lg">
                    <Link to="/contact">
                        <Mail className="mr-2 h-5 w-5" /> Contact Us
                    </Link>
                </Button>
            </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Index;