
import { Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className='bg-green-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-green-700'>Akshay</span>
            <span className='text-white'>Rents</span>
          </h1>=
        <ul className='flex gap-4'>
          {currentUser ? (
            <>
              <Link to='/schedules' className='hover:text-green-700 hover:underline'>
                <li className='hidden sm:inline text-green-700'>Schedules</li>
              </Link>
              <Link to='/listings' className='hover:text-green-700 hover:underline'>
                <li className='hidden sm:inline text-green-700'>Listings</li>
              </Link>
              <Link to='/profile' className='hover:text-green-700'>
                <img
                  className='rounded-full h-7 w-7 object-cover hover:shadow-md'
                  src={currentUser.avatar}
                  alt='profile'
                />
              </Link>
            </>
          ) : (
            <Link to='/signin' className='hover:text-green-700 hover:underline'>
              <li className='text-green-700 hover:underline'>Sign in</li>
            </Link>
          )}
        </ul>
      </div>
    </header>
  );
}
