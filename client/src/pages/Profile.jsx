import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserSuccess,
  signOutUserStart,
} from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };



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
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt='profile'
          className='rounded-full h-32 w-32 object-cover cursor-pointer border-4 border-gray-200 hover:border-blue-500'
        />
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type='file'
          ref={fileRef}
          hidden
          id='avatar'
          accept='image/*'
        />
      </label>
      <p className='text-sm text-gray-600'>
        Click to change profile picture
      </p>
    </div>
    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
      <input
        type='text'
        placeholder='Username'
        defaultValue={currentUser.username}
        id='username'
        className='border p-3 rounded-lg'
        onChange={handleChange}
      />
      <input
        type='email'
        placeholder='Email'
        defaultValue={currentUser.email}
        id='email'
        className='border p-3 rounded-lg'
        onChange={handleChange}
      />
      <input
        type='password'
        placeholder='Password'
        onChange={handleChange}
        id='password'
        className='border p-3 rounded-lg'
      />
      <button
        disabled={loading}
        className='bg-blue-500 text-white rounded-lg p-3 uppercase hover:bg-blue-600 disabled:opacity-80'
      >
        {loading ? 'Loading...' : 'Update'}
      </button>
    </form>
    <div className='flex justify-end mt-8'>
      <span
        onClick={handleSignOut}
        className='text-red-700 cursor-pointer hover:underline'
      >
        Sign out
      </span>
    </div>
    <p className='text-red-700 mt-5'>{error ? error : ''}</p>
    <p className='text-green-700 mt-5'>
      {updateSuccess ? 'User is updated successfully!' : ''}
    </p>
  </div>
</div>


  );
}
