import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import ScheduleComponent from '../components/schedule';
export default function Schedules() {
  const { currentUser } = useSelector((state) => state.user);
  const [scheduleData, setScheduleData] = useState([]);
  const [filterStatus, setFilterStatus] = useState('accepted');
  const [error, setError] = useState(null);
  useEffect(() => {
    fetch(`/api/user/acceptschedules/${currentUser._id}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else if (response.status === 404) {
          throw new Error('No schedule found');
        } else {
          throw new Error('Error fetching data');
        }
      })
      .then((data) => {
        setScheduleData(data);
        setError(null);
      })
      .catch((error) => {
        setError(error.message);
        console.error('Error fetching data:', error);
      });
  }, [currentUser._id]);

  const filterSchedules = (status) => {
    setFilterStatus(status);
  };

  const filteredSchedules = scheduleData.filter((scheduleItem) => {
    if (filterStatus === 'pending') {
      return scheduleItem.status === 'pending';
    } else if (filterStatus === 'accepted') {
      return scheduleItem.status === 'accepted';
    } else if (filterStatus === 'rejected') {
      return scheduleItem.status === 'rejected';
    }
    return true;
  });

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Schedules</h1>
      {error && <p>{error}</p>}
      {!error && (
        <div className="flex mb-4">
          <button
            className={`mr-4 tab-btn ${filterStatus === 'accepted' ? 'active-tab' : ''} `}
            onClick={() => filterSchedules('accepted')}
          >
            Accepted
          </button>
          <button
            className={`mr-4 tab-btn ${filterStatus === 'pending' ? 'active-tab' : ''}`}
            onClick={() => filterSchedules('pending')}
          >
            Pending
          </button>
          <button
            className={`mr-4 tab-btn ${filterStatus === 'rejected' ? 'active-tab' : ''}`}
            onClick={() => filterSchedules('rejected')}
          >
            Rejected
          </button>
        </div>
      )}
      {!error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchedules.length === 0 ? (
            <p>No schedules found.</p>
          ) : (
            filteredSchedules.map((scheduleItem) => (
              <ScheduleComponent key={scheduleItem.id} scheduleData={scheduleItem} fromUserDetails={scheduleItem.fromUserDetails}/>
            ))
          )}
        </div>
      )}
      <style>
        {`
          .tab-btn {
            padding: 8px 16px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f7f7f7;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .tab-btn:hover {
            background-color: #e0e0e0;
          }
          .active-tab {
            background-color: #3498db;
            color: #fff;
          }
        `}
      </style>
    </div>
  );
}
