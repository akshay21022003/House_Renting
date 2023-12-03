import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus } from 'react-icons/fa'; 

export default function Listings() {
  const { currentUser } = useSelector((state) => state.user);
  const [showListingsError, setShowListingsError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    const handleShowListings = async () => {
      try {
        setShowListingsError(false);
        const res = await fetch(`/api/user/listings/${currentUser._id}`);
        const data = await res.json();
        if (data.success === false) {
          setShowListingsError(true);
          return;
        }

        setUserListings(data);
      } catch (error) {
        setShowListingsError(true);
      }
    };
    handleShowListings();
  }, [currentUser._id]);

  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
  <div className='p-3 max-w-screen-xl mx-auto'>
    <h1 className="text-3xl font-bold mb-6">All listings</h1>
    <p className='text-red-700 mt-5'>
      {showListingsError && 'Error showing listings'}
    </p>
    <Link to='/create-listing' className='fixed bottom-8 right-8'>
      <button className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full shadow'>
        <FaPlus className='inline-block mr-1' />
        Create Listing
      </button>
    </Link>
    {userListings && userListings.length > 0 ? (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>
        {userListings.map((listing) => (
          <div
            key={listing._id}
            className='border rounded-lg overflow-hidden shadow-md'
          >
              <img
                src={listing.imageUrls[0]}
                alt='listing cover'
                className='h-60 w-full object-cover'
              />
            <div className='p-4'>
              <div className='text-gray-900 font-semibold hover:underline truncate block mb-2'>
              {listing.name}
              </div>
              

              <div className='flex justify-between items-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 font-semibold hover:underline uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 font-semibold hover:underline uppercase'>
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p>No listings found</p>
    )}
  </div>
);

  
}
