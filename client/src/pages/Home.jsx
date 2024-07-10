import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

export default function Home() {
  const [recentOffers, setRecentOffers] = useState([]);
  const [recentRentals, setRecentRentals] = useState([]);
  const [recentSales, setRecentSales] = useState([]);

  useEffect(() => {
    const fetchListings = async (type, limit, offer) => {
      const queryParams = new URLSearchParams();
      if (type) {
        queryParams.set("type", type);
      }
      queryParams.set("limit", limit);
      queryParams.set("sort", "createdAt");
      queryParams.set("order", "desc");
      if (offer) {
        queryParams.set("offer", "true");
      }

      const res = await fetch(`/api/listing/get?${queryParams.toString()}`);
      const data = await res.json();
      return data;
    };

    // Fetch recent offers
    fetchListings("", 3, true).then((data) => setRecentOffers(data));

    // Fetch recent rentals
    fetchListings("rent", 3, false).then((data) => setRecentRentals(data));

    // Fetch recent sales
    fetchListings("sale", 3, false).then((data) => setRecentSales(data));
  }, []);

  const calculateOfferPercentage = (regularPrice, discountPrice) => {
    if (discountPrice && regularPrice) {
      const percentage = ((regularPrice - discountPrice) / regularPrice) * 100;
      return Math.round(percentage);
    }
    return 0;
  };

  const renderListingCards = (listings) => {
    return (
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {listings.length > 0 ? (
          listings.map((listing) => (
            <div
              key={listing._id}
              className="bg-white shadow-md rounded-lg overflow-hidden"
            >
              <Link to={`/listing/${listing._id}`} className="block px-2">
                <img
                  src={listing.imageURLs[0]}
                  alt={listing.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-xl font-bold">{listing.name}</h3>
                      <p className="flex items-center text-gray-600">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 2a5 5 0 00-5 5v5a1 1 0 001 1h8a1 1 0 001-1V7a5 5 0 00-5-5zm3 10v1a1 1 0 01-1 1H8a1 1 0 01-1-1v-1h6z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {listing.address}
                      </p>
                    </div>
                    {listing.offer && (
                      <p className="text-green-600">
                        {calculateOfferPercentage(
                          listing.regularPrice,
                          listing.discountPrice
                        )}
                        % off
                      </p>
                    )}
                  </div>
                  <p className="text-gray-700 truncate">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-gray-900 font-semibold">
                      ${listing.regularPrice}
                    </p>
                    <Link
                      to={`/listing/${listing._id}`}
                      className="text-blue-500 hover:underline flex items-center"
                    >
                      View Details <IoIosArrowForward className="ml-1" />
                    </Link>
                  </div>
                </div>
              </Link>
            </div>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No listings found.
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Video Section */}
      <div className="absolute inset-0 z-0 overflow-hidden h-[70vh]">
        <video className="w-full h-full object-cover" autoPlay loop muted>
          <source
            src="https://cdn.pixabay.com/video/2022/10/31/137210-766502986_large.mp4"
            type="video/mp4"
          />
        </video>
      </div>

      {/* Headline Section */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white bg-black bg-opacity-50 p-10 h-[70vh]">
        <h1 className="text-4xl md:text-6xl font-bold">
          Discover Your Perfect Space
        </h1>
        <p className="mt-4 text-lg md:text-xl">
          Govind Estate helps you find your home with speed, ease, and comfort.
        </p>
        <Link
          to="/search"
          className="mt-8 text-white bg-blue-500 p-3 rounded font-semibold hover:underline"
        >
          Let's Get Started...
        </Link>
      </div>

      {/* Main Content */}
      <div className="relative z-20 bg-white">
        {/* Recent Offers Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-3xl font-semibold mb-4">Recent Offers</h2>
            {recentOffers.length > 0 && (
              <Link
                to="/search?offer=true"
                className="text-blue-500 flex items-center hover:underline"
              >
                View more offers <IoIosArrowForward className="ml-1" />
              </Link>
            )}
          </div>
          {renderListingCards(recentOffers)}
        </section>

        {/* Recent Rentals Section */}
        <section className="py-12 bg-gray-100">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-3xl font-semibold mb-4">Recent Rentals</h2>
            {recentRentals.length > 0 && (
              <Link
                to="/search?type=rent"
                className="text-blue-500 flex items-center hover:underline"
              >
                View more rentals <IoIosArrowForward className="ml-1" />
              </Link>
            )}
          </div>
          {renderListingCards(recentRentals)}
        </section>

        {/* Recent Sales Section */}
        <section className="py-12">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <h2 className="text-3xl font-semibold mb-4">Recent Sales</h2>
            {recentSales.length > 0 && (
              <Link
                to="/search?type=sale"
                className="text-blue-500 flex items-center hover:underline"
              >
                View more sales <IoIosArrowForward className="ml-1" />
              </Link>
            )}
          </div>
          {renderListingCards(recentSales)}
        </section>
      </div>
    </div>
  );
}
