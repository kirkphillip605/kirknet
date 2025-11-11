import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Mail, Phone, User, Building, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FormData {
  name: string;
  businessName?: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  timestamp: string;
}

const serviceMap: Record<string, string> = {
  msp: 'Managed Services (MSP)',
  'app-development': 'App Development',
  'web-development': 'Web Development',
  'software-development': 'Software Development',
  'it-consultation': 'IT Consultation',
  other: 'Other',
};

export function ContactConfirmation() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Retrieve form data from sessionStorage
    const storedData = sessionStorage.getItem('contactFormData');
    
    if (storedData) {
      try {
        const data = JSON.parse(storedData);
        setFormData(data);
        // Clear the data from sessionStorage after retrieving it
        sessionStorage.removeItem('contactFormData');
      } catch (error) {
        console.error('Error parsing form data:', error);
        navigate('/contact');
      }
    } else {
      // If no data found, redirect to contact page
      navigate('/contact');
    }
  }, [navigate]);

  if (!formData) {
    return null;
  }

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="bg-white text-gray-800 font-sans min-h-screen">
      <header className="sticky top-0 bg-white/80 backdrop-blur-sm z-10 border-b">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-20">
          <Link to="/">
            <img src="/kirknetlogo.png" alt="KirkNetworks Logo" className="h-12" />
          </Link>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-3xl mx-auto">
          {/* Success Message */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircle2 className="h-20 w-20 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Message Sent Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for contacting us. We've received your message and will get back to you as soon as possible.
            </p>
          </div>

          {/* Submission Details Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg shadow-lg p-8 mb-8 border border-blue-100">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b border-blue-200 pb-3">
              Your Submission Details
            </h2>
            
            <div className="space-y-4">
              {/* Name */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Full Name</p>
                  <p className="text-base text-gray-900 font-semibold">{formData.name}</p>
                </div>
              </div>

              {/* Business Name */}
              {formData.businessName && (
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-1">
                    <Building className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="ml-3 flex-grow">
                    <p className="text-sm font-medium text-gray-500">Business Name</p>
                    <p className="text-base text-gray-900 font-semibold">{formData.businessName}</p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Email Address</p>
                  <p className="text-base text-gray-900 font-semibold">{formData.email}</p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <Phone className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Phone Number</p>
                  <p className="text-base text-gray-900 font-semibold">{formData.phone}</p>
                </div>
              </div>

              {/* Service */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Service of Interest</p>
                  <p className="text-base text-gray-900 font-semibold">
                    {serviceMap[formData.service] || formData.service}
                  </p>
                </div>
              </div>

              {/* Message */}
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Your Message</p>
                  <p className="text-base text-gray-900 mt-1 whitespace-pre-wrap bg-white p-4 rounded border border-blue-100">
                    {formData.message}
                  </p>
                </div>
              </div>

              {/* Timestamp */}
              <div className="flex items-start pt-4 border-t border-blue-200">
                <div className="flex-shrink-0 mt-1">
                  <Calendar className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm font-medium text-gray-500">Submitted On</p>
                  <p className="text-sm text-gray-700">{formatDate(formData.timestamp)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>Our team will review your message within 1-2 business days</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>We'll reach out to you via email or phone to discuss your needs</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">•</span>
                <span>For urgent matters, feel free to call us directly</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button className="bg-blue-700 hover:bg-blue-800 text-white w-full sm:w-auto">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" className="w-full sm:w-auto">
                Send Another Message
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
