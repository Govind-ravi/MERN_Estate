import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RiEdit2Line, RiDeleteBin6Line } from "react-icons/ri"; // Import icons as per your preference

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

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }
      setListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      {listings.length !== 0 && (
        <h1 className="text-3xl font-semibold mb-6 text-center">
          Your Listings
        </h1>
      )}
      {listings.length === 0 ? (
        <Link
          to="/create-listing"
          className="block w-full max-w-sm mx-auto bg-gray-800 text-white text-lg py-2 px-4 rounded-lg text-center hover:bg-gray-700"
        >
          Create Your First Listing
        </Link>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((listing) => {
            const discountPercentage = listing.offer
              ? Math.round(
                  ((listing.regularPrice - listing.discountPrice) /
                    listing.regularPrice) *
                    100
                )
              : null;
            return (
              <div
                key={listing._id}
                className="bg-white shadow-md rounded-lg overflow-hidden"
              >
                <img
                  src={listing.imageURLs[0]}
                  alt="Listing"
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 truncate">
                    {listing.name} - &#8377{listing.regularPrice}{" "}
                    {discountPercentage && (
                      <span className="text-sm text-red-500">
                        ({discountPercentage}% off)
                      </span>
                    )}
                  </h2>
                  <p className="text-gray-700 mb-4 truncate">
                    {listing.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      View Details
                    </Link>
                    <div className="flex gap-4">
                      <Link to={`/update-listing/${listing._id}`}>
                        <button className="flex items-center justify-center p-2 rounded-md text-blue-500 hover:text-blue-600 focus:outline-none">
                          <RiEdit2Line className="text-lg" />
                          <span className="ml-1">Edit</span>
                        </button>
                      </Link>
                      <button
                        className="flex items-center justify-center p-2 rounded-md text-red-500 hover:text-red-600 focus:outline-none"
                        onClick={() => handleListingDelete(listing._id)}
                      >
                        <RiDeleteBin6Line className="text-lg" />
                        <span className="ml-1">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
