import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

export default function UserListing() {
  const { currentUser } = useSelector((state) => state.user);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        if (!res.ok) {
          throw new Error("Failed to fetch listings");
        }
        const data = await res.json();
        setLoading(false);
        setListings(data);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchListings();
    }
  }, [currentUser]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      {listings.length !== 0 && <h1 className="m-2 p-2 text-3xl font-semibold mb-2 text-center">Your Listings</h1>}
      {listings.length === 0 ? (
        <Link className="p-2 m-2 bg-gray-800 text-white text-lg">Create Your First Listing </Link>
      ) : (
        
        <div className='p-4 max-w-6xl mx-auto'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {listings.map((listing) => (
          <Link key={listing.id} className="block max-w-xl" to={`/listings/${listing.id}`}>
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <img
                src={listing.imageURLs[0]}
                alt="Listing"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-2xl font-semibold mb-2">
                  {listing.name}
                </h2>
                <p className="text-gray-700">{listing.description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
      )}
    </div>
  );
}
