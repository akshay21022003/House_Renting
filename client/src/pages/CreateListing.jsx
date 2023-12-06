import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    parking: false,
    furnished: false,
    city: ''.toLowerCase(),
    country: ''
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index),
    });
  };

  const handleChange = (e) => {
    if (e.target.id === 'sale' || e.target.id === 'rent') {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === 'parking' ||
      e.target.id === 'furnished' ||
      e.target.id === 'offer'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === 'number' ||
      e.target.type === 'text' ||
      e.target.type === 'textarea'
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrls.length < 4)
        return setError('You must upload at least four images');
      if (+formData.regularPrice < +formData.discountPrice)
        return setError('Discount price must be lower than regular price');
      setLoading(true);
      setError(false);
      const res = await fetch('/api/listing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id,
          username: currentUser.username,
          avatar: currentUser.avatar,
          mobilenumber: currentUser.mobilenumber
        }),
      });
      const data = await res.json();
      setLoading(false);
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listings`);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };
  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>
        Create a Listing
      </h1>
      <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
        <div className='container mx-auto p-6'>
        <div className='card bg-white p-6 rounded-lg shadow-md'>
          <div className='flex flex-col gap-4 flex-1'>
            <input
              type='text'
              placeholder='Name'
              className='border p-3 rounded-lg'
              id='name'
              maxLength='62'
              minLength='10'
              required
              onChange={handleChange}
              value={formData.name}
            />
            <textarea
              type='text'
              placeholder='Description'
              className='border p-3 rounded-lg'
              id='description'
              required
              onChange={handleChange}
              value={formData.description}
            />
            <input
              type='text'
              placeholder='Flat No ,Building Name ,Street ,LandMark '
              className='border p-3 rounded-lg'
              id='address'
              required
              onChange={handleChange}
              value={formData.address}
            />
            <input
              type='text'
              placeholder='City'
              className='border p-3 rounded-lg'
              id='city'
              required
              onChange={handleChange}
              value={formData.city}
            />
            <input
              type='text'
              placeholder='Country'
              className='border p-3 rounded-lg'
              id='country'
              required
              onChange={handleChange}
              value={formData.country}
            />
            <div className='flex gap-6 flex-wrap'>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='parking'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.parking}
                />
                <span>Parking</span>
              </div>
              <div className='flex gap-2'>
                <input
                  type='checkbox'
                  id='furnished'
                  className='w-5'
                  onChange={handleChange}
                  checked={formData.furnished}
                />
                <span>Furnished</span>
              </div>
            </div>
            <div className='flex flex-wrap gap-6'>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bedrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.bedrooms}
                />
                <p>Beds</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='bathrooms'
                  min='1'
                  max='10'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.bathrooms}
                />
                <p>Baths</p>
              </div>
              <div className='flex items-center gap-2'>
                <input
                  type='number'
                  id='regularPrice'
                  min='50'
                  max='10000000'
                  required
                  className='p-3 border border-gray-300 rounded-lg'
                  onChange={handleChange}
                  value={formData.regularPrice}
                />
                <div className='flex flex-col items-center'>
                  <p>Regular price</p>
                  <span className='text-xs'>(₹ / month)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className='container mx-auto p-6'>
          <div className='bg-white shadow-md rounded-md p-8'>
            <p className='text-lg font-semibold'>
              Images Upload
              <span className='text-gray-600 text-sm block mt-2'>
                Choose up to 6 images. The first one will be the cover.
              </span>
            </p>
            <div className='flex flex-col gap-4 mt-6'>
              <input
                onChange={(e) => setFiles(e.target.files)}
                className='p-3 border border-gray-300 rounded w-full'
                type='file'
                id='images'
                accept='image/*'
                multiple
              />
              <button
                type='button'
                disabled={uploading}
                onClick={handleImageSubmit}
                className='p-3 bg-blue-500 text-white rounded uppercase hover:bg-green-600 transition-all duration-300 disabled:opacity-80'
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
              {imageUploadError && (
                <p className='text-red-700 text-sm'>{imageUploadError}</p>
              )}
            </div>
            {formData.imageUrls.length > 0 && (
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8'>
                {formData.imageUrls.map((url, index) => (
                  <div
                    key={url}
                    className='relative group rounded overflow-hidden bg-gray-200'
                  >
                    <img
                      src={url}
                      alt='listing image'
                      className='w-full h-40 object-cover transition duration-300 transform group-hover:scale-105'
                    />
                    <button
                      type='button'
                      onClick={() => handleRemoveImage(index)}
                      className='absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition duration-300'
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              disabled={loading || uploading}
              className='w-full p-3 bg-green-500 text-white rounded-lg uppercase mt-8 hover:bg-blue-600 transition-all duration-300 disabled:opacity-80'
            >
              {loading ? 'Creating...' : 'Create listing'}
            </button>
            {error && <p className='text-red-700 text-sm mt-4'>{error}</p>}
          </div>
        </div>

      </form>
    </main>
  );
}
