import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaMapMarkerAlt, FaBed, FaBath, FaParking, FaCouch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          setLoading(false);
          return setError(true);
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  if (loading) return <ClipLoader color="#3498db" loading={loading} size={40} />;
  if (error) return <p>Error loading listing.</p>;

  const images = listing.imageURLs; // Use the images from the fetched listing

  return (
    <div>
      {/* Image Slider */}
      <div className="w-full h-[50vh]">
        <Slider {...settings}>
          {images.map((image, index) => (
            <div key={index}>
              <img src={image} alt={`Slide ${index}`} className="w-full h-[50vh] object-cover" />
            </div>
          ))}
        </Slider>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Title and Price */}
        <div className="flex justify-between items-center mt-4">
          <h1 className="text-3xl font-bold">
            {listing.name}
          </h1>
          <span className="text-3xl font-bold">
            ${listing.regularPrice}{listing.type === "rent" && "/month"}
          </span>
        </div>
        {/* Discount Price */}
        {listing.offer && (
          <div className="text-xl text-red-500 mt-2">
            Offer Price: ${listing.discountPrice}{listing.type === "rent" && "/month"}
          </div>
        )}

        {/* Rent Box */}
        <div className="bg-green-500 text-white px-4 py-2 mt-2 inline-block rounded">
          {listing.type === "rent" ? "Rent" : "Sale"}
        </div>

        {/* Address */}
        <div className="flex items-center mt-4 text-gray-600">
          <FaMapMarkerAlt className="mr-2" />
          <span>{listing.address}</span>
        </div>

        {/* Description */}
        <p className="mt-4 text-gray-800">{listing.description}</p>

        {/* Additional Information */}
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="flex items-center text-gray-700">
            <FaBed className="mr-2" />
            <span>{listing.bedrooms} Beds</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBath className="mr-2" />
            <span>{listing.bathrooms} Baths</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaParking className="mr-2" />
            <span>{listing.parking ? "Parking Available" : "No Parking"}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaCouch className="mr-2" />
            <span>{listing.furnished ? "Furnished" : "Not Furnished"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
