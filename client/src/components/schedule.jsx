import React, { useReducer } from 'react';
const ScheduleComponent = ({ scheduleData }) => {
    
  const { id,requestTime, status, listingDetails } = scheduleData;
  const { name, description, address, city, country, imageUrls } = listingDetails;
  const isPending = status === 'pending';
  const isAccepted = status === 'accepted';
  const isRejected = status === 'rejected';
  
  const firstFourImages = imageUrls.slice(0, 4);

  const handleAccept = () => {
    acceptSchedule(id);
  };

  const handleReject = () => {
    rejectSchedule(id);
  };
  const acceptSchedule = async (id) => {
    try {
      const response = await fetch(`/api/user/schedule/${id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.reload();
        dispatch({ type: 'SCHEDULE_ACCEPTED', payload: id }); // Update this according to your reducer logic
        
        
      } else {
        throw new Error('Failed to accept schedule');
      }
    } catch (error) {
      console.error('Error accepting schedule:', error);
      // Handle error or dispatch an action to update state with error
    }
  };

  const rejectSchedule = async (id) => {
    try {
      const response = await fetch(`/api/user/schedule/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        window.location.reload();
        dispatch({ type: 'SCHEDULE_REJECTED', payload: id }); // Update this according to your reducer logic
        
      } else {
        throw new Error('Failed to reject schedule');
      }
    } catch (error) {
      console.error('Error rejecting schedule:', error);
      // Handle error or dispatch an action to update state with error
    }
  };
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{name}</h2>
        {isPending && (
          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleAccept()}
              className="px-4 py-2 bg-green-500 text-white rounded font-semibold hover:bg-green-600 transition duration-300"
            >
              Accept
            </button>
            <button
              onClick={() => handleReject()}
              className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600 transition duration-300"
            >
              Reject
            </button>
          </div>
        )}
        {isAccepted && <p className="text-green-500 font-semibold">Accepted</p>}
        {isRejected && <p className="text-red-500 font-semibold">Rejected</p>}
      </div>
      <div>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">Description:</span> {description}
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">Address:</span> {`${address}, ${city}, ${country}`}
        </p>
        <p className="text-gray-600 mt-2">
          <span className="font-semibold">Request Time:</span>{' '}
          {new Date(requestTime).toLocaleString()}
        </p>
      </div>

      <div className="mt-4">
        {/* Show only the first image */}
        <div className="relative w-full rounded-lg overflow-hidden" style={{ maxHeight: '400px' }}>
          <img
            src={firstFourImages[0]} // Assuming firstFourImages is an array of image URLs
            alt={`Property 1`}
            className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
          />
        </div>
      </div>
    </div>
  );
  
};

export default ScheduleComponent;
