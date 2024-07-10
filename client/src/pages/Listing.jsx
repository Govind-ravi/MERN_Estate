import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaMapMarkerAlt,
  FaBed,
  FaBath,
  FaParking,
  FaCouch,
} from "react-icons/fa";
import { useParams } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useSelector } from "react-redux";
import Contact from "../components/Contact";

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [contact, setContact] = useState(false);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const imagesModalRef = useRef();

  const settings1 = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    arrows: false,
    adaptiveHeight: true,
  };
  const settings2 = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    adaptiveHeight: true,
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (imagesModalRef.current && !imagesModalRef.current.contains(event.target)) {
        setShowImagesModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (loading)
    return <ClipLoader color="#3498db" loading={loading} size={40} />;
  if (error) return <p>Error loading listing.</p>;

  const images = listing.imageURLs; // Use the images from the fetched listing

  const openImagesModal = () => {
    setShowImagesModal(true);
  };

  const closeImagesModal = () => {
    setShowImagesModal(false);
  };

  return (
    <div className="relative">
      {/* Image Slider */}
      <div className="w-full h-[50vh]">
        <Slider {...settings1}>
          {images.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt={`Slide ${index}`}
                className="w-full h-[50vh] object-cover"
              />
            </div>
          ))}
        </Slider>
      </div>

      <div className="max-w-4xl mx-auto relative p-2">
        {/* Title and Price */}
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
          <h1 className="text-3xl font-bold">{listing.name}</h1>
          <span className="text-3xl font-bold">
          ₹{listing.regularPrice}
            {listing.type === "rent" && "/month"}
          </span>
        </div>
        {/* Discount Price */}
        {listing.offer && (
          <div className="text-xl text-red-500 mt-2">
            Offer Price: ₹{listing.discountPrice}
            {listing.type === "rent" && "/month"}
          </div>
        )}

        {/* Rent Box */}
        <div className="bg-green-700 text-white px-4 py-2 mt-2 inline-block rounded font-semibold">
          {listing.type === "rent" ? "For Rent" : "For Sale"}
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
            <span>
              {listing.bedrooms}
              {listing.bedrooms > 1 ? " Beds" : " Bed"}
            </span>
          </div>
          <div className="flex items-center text-gray-700">
            <FaBath className="mr-2" />
            <span>
              {listing.bathrooms}
              {listing.bathrooms > 1 ? " Baths" : " Bath"}
            </span>
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

        {currentUser && listing.userRef !== currentUser._id && !contact && (
          <button
            onClick={() => setContact(true)}
            className="w-full bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3 mt-4"
          >
            Contact Landlord
          </button>
        )}

        {contact && <Contact listing={listing} />}

        {/* View all images button */}
        <div className="fixed bottom-4 right-4">
          <button
            className="flex items-center bg-indigo-900 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600 focus:outline-none"
            onClick={openImagesModal}
          >
            View All Images
          </button>
        </div>

        {/* Images Modal */}
        {showImagesModal && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
            <div ref={imagesModalRef} className="relative w-[70vw] h-[50vh] md:h-[80vh]">
              <Slider {...settings2}>
                {images.map((image, index) => (
                  <div key={index}>
                    <img
                      src={image}
                      alt={`Slide ${index}`}
                      className="w-full h-[50vh] md:h-[80vh] object-contain"
                    />
                  </div>
                ))}
              </Slider>
              <button
                className="absolute top-2 right-2 text-white text-xl focus:outline-none"
                onClick={closeImagesModal}
              >
                &times;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
