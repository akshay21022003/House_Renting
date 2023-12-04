import { useSelector } from 'react-redux';
import { useState } from 'react';
import {
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
export default function Profile() {
  const { currentUser, error } = useSelector((state) => state.user);
  const [formData] = useState({});
  const dispatch = useDispatch();

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(data.message));
    }
  };
  return (
<div className='bg-green-50 min-h-screen flex flex-col justify-center items-center'>
  <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-md'>
    <h1 className='text-3xl font-semibold mb-6 text-center'>Your Profile</h1>
    <div className='flex flex-col items-center mb-8'>
      <label htmlFor='avatar' className='cursor-pointer'>
        <img
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-200 hover:border-blue-500'
        />
      </label>
    </div>
    <div className='flex flex-col gap-4'>
      <div className='border p-3 rounded-lg'>
        <div>{currentUser.username}</div>
      </div>
      <div className='border p-3 rounded-lg'>
        <div>{currentUser.email}</div>
      </div>
    </div>
    <div className='flex justify-end mt-8'>
      <span
        onClick={handleSignOut}
        className='text-red-700 cursor-pointer hover:underline'
      >
        Sign out
      </span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
  </div>
</div>
  );
}
