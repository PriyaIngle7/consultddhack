import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-secondary text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1">
            <img
              src="https://www.consultadd.com/wp-content/uploads/2023/11/ConsultAdd_Logo_White.svg"
              alt="ConsultAdd Logo"
              className="h-8 mb-4"
            />
            <p className="text-sm text-gray-300 mb-4">
              ConsultAdd Inc. is a global technology consulting and digital solutions company.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Phone:</strong>{' '}
                <a href="tel:+1-646-461-7766" className="hover:text-primary">
                  +1-646-461-7766
                </a>
              </p>
              <p className="text-sm">
                <strong>Email:</strong>{' '}
                <a href="mailto:info@consultadd.com" className="hover:text-primary">
                  info@consultadd.com
                </a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.consultadd.com/about-us/" className="text-sm text-gray-300 hover:text-primary">
                  About Us
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/services/" className="text-sm text-gray-300 hover:text-primary">
                  Services
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/contact-us/" className="text-sm text-gray-300 hover:text-primary">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/careers/" className="text-sm text-gray-300 hover:text-primary">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li>
                <a href="https://www.consultadd.com/services/digital-transformation/" className="text-sm text-gray-300 hover:text-primary">
                  Digital Transformation
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/services/cloud-services/" className="text-sm text-gray-300 hover:text-primary">
                  Cloud Services
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/services/data-analytics/" className="text-sm text-gray-300 hover:text-primary">
                  Data Analytics
                </a>
              </li>
              <li>
                <a href="https://www.consultadd.com/services/cybersecurity/" className="text-sm text-gray-300 hover:text-primary">
                  Cybersecurity
                </a>
              </li>
            </ul>
          </div>

          {/* Locations */}
          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-4">Locations</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-1">USA (HQ)</h4>
                <p className="text-sm text-gray-300">
                  1200 Route 22 East, Suite 2000<br />
                  Bridgewater, NJ 08807
                </p>
              </div>
              <div>
                <h4 className="font-medium mb-1">India</h4>
                <p className="text-sm text-gray-300">
                  A-118, Sector 63<br />
                  Noida, UP 201301
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-300">
              © {new Date().getFullYear()} ConsultAdd Inc. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="https://www.consultadd.com/privacy-policy/" className="text-sm text-gray-300 hover:text-primary">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="https://www.consultadd.com/terms-of-use/" className="text-sm text-gray-300 hover:text-primary">
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 