import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Trending from './components/Trending';
import Popular from './components/Popular';
import Movie from './components/Movie';
import TvShows from './components/TvShows';
import People from './components/People';
import MovieDetails from './components/helper/MovieDetails';
import TvDetails from './components/helper/TvDetails';
import PersonDetails from './components/helper/PersonDetails';
import Trailer from './components/helper/Trailer';
import MySpace from './components/MySpace';
import SignUp from './components/helper/SignUp';
import { Toaster } from 'react-hot-toast';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  document.title = "Vybe | Home";
  return (
    <div className='w-screen h-screen bg-[#13141A] flex font-jose'>
      <Toaster />
      <Routes>
        {/* ✅ Login and Signup Routes */}
        <Route path='/' element={<MySpace />} />
        <Route path='/myspace' element={<SignUp />} />

        {/* ✅ Protected Routes */}
        <Route path='/home' element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path='/trending' element={<ProtectedRoute><Trending /></ProtectedRoute>} />
        <Route path='/popular' element={<ProtectedRoute><Popular /></ProtectedRoute>} />
        <Route path='/movie' element={<ProtectedRoute><Movie /></ProtectedRoute>} />
        <Route path='/movie/details/:id' element={<ProtectedRoute><MovieDetails /></ProtectedRoute>}>
          <Route path='trailer' element={<ProtectedRoute><Trailer /></ProtectedRoute>} />
        </Route>
        <Route path='/tv' element={<ProtectedRoute><TvShows /></ProtectedRoute>} />
        <Route path='/tv/details/:id' element={<ProtectedRoute><TvDetails /></ProtectedRoute>}>
          <Route path='trailer' element={<ProtectedRoute><Trailer /></ProtectedRoute>} />
        </Route>
        <Route path='/person' element={<ProtectedRoute><People /></ProtectedRoute>} >
          <Route path='/person/details/:id' element={<ProtectedRoute><PersonDetails /></ProtectedRoute>} />
        </Route>

        {/* ✅ 404 Page */}
        <Route path='*' element={<img className="w-[10rem] h-[10rem] object-cover object-center flex justify-center items-center absolute translate-x-[360%] translate-y-[150%] overflow-hidden" src="https://cdn-icons-png.flaticon.com/128/4826/4826313.png" alt="Page Not Found!" />} />
      </Routes>
    </div>
  );
}

export default App;
