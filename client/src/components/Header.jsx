import { useState, useRef, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  return (
    <header className="bg-gray-900 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="text-yellow-400">Ravi</span>
            <span className="text-yellow-200">Estate</span>
          </h1>
        </Link>

        <form
          onSubmit={handleSubmit}
          className="sm:flex items-center ml-4 hidden"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-800 text-white px-3 py-1 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-gray-800 text-white p-2 rounded-lg"
            style={{ minWidth: "auto" }} // Adjusted button style
          >
            <FaSearch className="text-white" />
          </button>
        </form>

        {/* Desktop Navigation */}
        <nav className="hidden sm:flex space-x-4 items-center">
          <Link to="/" className="text-white hover:text-yellow-300">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-yellow-300">
            About
          </Link>
          <Link to="/profile" className="text-white hover:text-yellow-300">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              "Sign In"
            )}
          </Link>
        </nav>

        <div className="flex gap-4 items-center">
        <form 
                  onSubmit={handleSubmit}
                  className="flex items-center ml-4 sm:hidden"
                >
                  <button
                    type="submit"
                    className=" text-white p-2 text-lg opacity-50"
                    style={{ minWidth: "auto" }} // Adjusted button style
                  >
                    <FaSearch className="text-white" />
                  </button>
                </form>

        {/* Mobile Menu Toggle */}
        <div className="sm:hidden flex items-center">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-white focus:outline-none"
          >
            {isMenuOpen ? (
              <FaTimes className="text-2xl" />
            ) : (
                
                <FaBars className="text-2xl" />
              )}
          </button>
              </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="sm:hidden fixed inset-0 bg-gray-800 bg-opacity-75 z-50"
            onClick={() => setIsMenuOpen(false)}
          >
            <div
              className="max-w-[70vw] w-full bg-gray-900 h-full py-6 px-4 flex flex-col space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Link
                to="/"
                className="text-white hover:text-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="text-white hover:text-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/profile"
                className="text-white hover:text-yellow-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {currentUser ? (
                  <div className="flex items-center">
                    <img
                      src={currentUser.avatar}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover mr-2"
                    />
                    Profile
                  </div>
                ) : (
                  "Sign In"
                )}
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
