import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone } from "lucide-react";

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
            <a href="mailto:phillip@kirknetllc.com">Get a Quote</a>
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
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button asChild size="lg" className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-4 text-lg w-full sm:w-auto">
                        <a href="mailto:phillip@kirknetllc.com">
                            <Mail className="mr-2 h-5 w-5" /> Email Us
                        </a>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg w-full sm:w-auto">
                        <a href="tel:+16059541144">
                            <Phone className="mr-2 h-5 w-5" /> Call (605) 954-1144
                        </a>
                    </Button>
                </div>
            </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-xl font-bold">KirkNetworks, LLC</h3>
            <div className="mt-4 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6 text-gray-300">
                <a href="mailto:phillip@kirknetllc.com" className="hover:text-white transition-colors flex items-center">
                    <Mail className="mr-2 h-4 w-4" /> phillip@kirknetllc.com
                </a>
                <a href="tel:+16059541144" className="hover:text-white transition-colors flex items-center">
                    <Phone className="mr-2 h-4 w-4" /> +1 (605) 954-1144
                </a>
            </div>
            <div className="mt-8 border-t border-gray-700 pt-8">
                <p className="text-sm text-gray-400">&copy; {new Date().getFullYear()} KirkNetworks, LLC. All Rights Reserved.</p>
                <p className="text-sm text-gray-500 mt-1">Watertown, SD</p>
            </div>
        </div>
      </footer>
    </div>
  );
};