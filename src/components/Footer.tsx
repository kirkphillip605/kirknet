import { Link } from "react-router-dom";
import { Mail, MapPin } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">KirkNetworks, LLC</h3>
            <div className="flex items-start text-gray-300 mb-3">
              <MapPin className="mr-2 h-5 w-5 mt-0.5 flex-shrink-0" />
              <span>Watertown, SD</span>
            </div>
            <p className="text-sm text-gray-400">
              Your trusted technology partner providing expert IT solutions and custom software development.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/services/msp" className="text-gray-300 hover:text-white transition-colors">
                  Managed Services (MSP)
                </Link>
              </li>
              <li>
                <Link to="/services/it-consultation" className="text-gray-300 hover:text-white transition-colors">
                  IT Consultation
                </Link>
              </li>
              <li>
                <Link to="/services/software-development" className="text-gray-300 hover:text-white transition-colors">
                  Software Development
                </Link>
              </li>
              <li>
                <Link to="/services/web-development" className="text-gray-300 hover:text-white transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/services/app-development" className="text-gray-300 hover:text-white transition-colors">
                  App Development
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Get in Touch</h4>
            <p className="text-gray-300 mb-4">
              Ready to start your project? We'd love to hear from you.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center bg-blue-700 hover:bg-blue-800 text-white px-6 py-2.5 rounded-md transition-colors"
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Us
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm text-gray-400">
            &copy; {currentYear} KirkNetworks, LLC. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};
