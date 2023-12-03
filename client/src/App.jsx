import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Profile from './pages/Profile';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import CreateListing from './pages/CreateListing';
import UpdateListing from './pages/UpdateListing';
import Listings from './pages/Listings';
import Schedules from './pages/Schedules';
export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route path='/' element={<SignIn />} />
        <Route path='/schedules' element={<Schedules/>}/>\
        <Route path='/listings' element={<Listings/>}/>
        <Route element={<PrivateRoute />}>
          <Route path='/profile' element={<Profile />} />
          <Route path='/create-listing' element={<CreateListing />} />
          <Route
            path='/update-listing/:listingId'
            element={<UpdateListing />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
