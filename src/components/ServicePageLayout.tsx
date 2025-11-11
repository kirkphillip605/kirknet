import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail } from "lucide-react";
import { Footer } from "@/components/Footer";

interface ServicePageLayoutProps {
  title: string;
  imageUrl: string;
  children: React.ReactNode;
}

export const ServicePageLayout = ({ title, imageUrl, children }: ServicePageLayoutProps) => {
  return (
    <div className="bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/">
            <img src="/kirknetlogo.png" alt="KirkNetworks Logo" className="h-12" />
          </Link>
          <Button asChild className="bg-blue-700 hover:bg-blue-800 text-white">
            <Link to="/contact">Get a Quote</Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-8 text-center">{title}</h1>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img src={imageUrl} alt={title} className="rounded-lg shadow-lg w-full h-auto object-cover" />
          </div>
          <div className="prose lg:prose-lg max-w-none text-gray-600">
            {children}
          </div>
        </div>

        {/* Contact Section */}
        <section id="contact" className="mt-20 py-16 bg-gray-50 rounded-lg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to get started?</h2>
                <p className="mt-4 text-lg text-gray-600 mb-8">Let's discuss how our {title} services can benefit your business.</p>
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