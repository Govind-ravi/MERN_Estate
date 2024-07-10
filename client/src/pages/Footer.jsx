import React from "react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center">
          <div className="w-full mb-4 md:mb-0">
            <div className="flex flex-col md:flex-row items-start md:justify-center">
              <h3 className="text-xl font-bold mr-2">Quick Links:</h3>
              <ul className="flex flex-col md:flex-row md:space-x-6 font-semibold text-lg">
                <li>
                  <a href="/search" className="hover:text-gray-300">
                    Get Started
                  </a>
                </li>
                <li>
                  <a href="/search?type=rent" className="hover:text-gray-300">
                    Rentals
                  </a>
                </li>
                <li>
                  <a href="/search?type=sale" className="hover:text-gray-300">
                    Sales
                  </a>
                </li>
                <li>
                  <a href="/search?offer=true" className="hover:text-gray-300">
                    Offers
                  </a>
                </li>
                <li>
                  <a href="/your-listings" className="hover:text-gray-300">
                    Your Listings
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="w-full text-center">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} Govind Estate. All rights
              reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
