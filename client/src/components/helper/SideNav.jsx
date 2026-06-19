import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';
import './SideNav.css';
import { toast } from 'react-hot-toast';

function SideNav() {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const backdropRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [recommendUrl, setRecommendUrl] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const savedUrl = localStorage.getItem("recommendUrl");
    if (savedUrl) setRecommendUrl(savedUrl);
  }, []);

  const handleSaveUrl = () => {
    if (recommendUrl.trim()) {
      localStorage.setItem("recommendUrl", recommendUrl);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const savedState = localStorage.getItem('sidebarState');
    if (savedState === 'open') {
      setIsOpen(true);
      openSidebar();
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') closeSidebar();
    };

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target) && !event.target.closest('.burger-menu')) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    closeSidebar(); 
  }, [location.pathname]); 

  const openSidebar = () => {
    gsap.to(sidebarRef.current, { duration: 0.5, x: 0, ease: 'power2.out' });
    gsap.to(backdropRef.current, { duration: 0.5, opacity: 0.6, ease: 'power2.out' });
  };

  const closeSidebar = () => {
    gsap.to(sidebarRef.current, { duration: 0.5, x: '0%', ease: 'power2.inOut' });
    gsap.to(backdropRef.current, { duration: 0.5, opacity: 0, ease: 'power2.inOut' });
    setIsOpen(false); 
  };

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    localStorage.setItem('sidebarState', newState ? 'open' : 'closed');
    if (newState) {
      openSidebar();
    } else {
      closeSidebar();
    }
  };

  const handleLogout = () => {
    toast.success('Successfully logged out');
    navigate('/');
    console.log('Logged out');
    closeSidebar();
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div
        className={`burger-menu ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle sidebar"
        role="button"
      >
        <i className="ri-menu-line text-[1.7rem]"></i>
        <i className="ri-close-line"></i>
      </div>
      <div className={`backdrop ${isOpen ? 'visible' : ''}`} onClick={closeSidebar}></div>
      <div ref={sidebarRef} className={`navChange ${isOpen ? 'open' : ''}`}>
        <div className="header">
            <h1 className='logo p-4 flex items-center'>
              <i className="ml-[-6%] fi fi-sr-play-alt text-[#009FFD] text-3xl rounded-lg"></i>
              <span className='ml-3 font-jose1 text-3xl'>Vybe</span>
            </h1>
        </div>
        <nav className='flex flex-col gap-3 mt-4 text-lg font-bold'>
          <Link to={'/home'} className={`nav-item ${isActive('home') ? 'active' : ''}`} onClick={closeSidebar}>
            <i className="fi fi-sr-home text-xl mr-4 ml-1 mt-[1.3%]"></i>
            <span className="nav-text">Home</span>
            {isActive('/home') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          <Link to={"/trending"} className={`nav-item ${isActive('/trending') ? 'active' : ''}`} onClick={closeSidebar}>
            <i className="ri-fire-fill text-2xl mr-3"></i>
            <span className="nav-text">Trending</span>
            {isActive('/trending') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          <Link to={'/popular'} className={`nav-item ${isActive('/popular') ? 'active' : ''}`} onClick={closeSidebar}>
            <i className="ri-sparkling-2-fill text-2xl mr-3"></i>
            <span className="nav-text">Popular</span>
            {isActive('/popular') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          <Link to={'/movie'} className={`nav-item ${isActive('/movie') ? 'active' : ''}`} onClick={closeSidebar}>
            <i className="fi fi-sr-clapperboard-play text-2xl mr-4  mt-[1.3%]"></i>
            <span className="nav-text">Movies</span>
            {isActive('/movie') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          <Link to={'/tv'} className={`nav-item ${isActive('/tv') ? 'active' : ''}`} onClick={closeSidebar}>
            <i className="fi fi-sr-screen text-2xl mr-3  mt-[1.5%]"></i>
            <span className="nav-text">Tv Shows</span>
            {isActive('/tv') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          
          <Link to={'/person'} className={`nav-item ${isActive('/person') ? 'active' : ''}`} onClick={() =>('/person')}>
            <i className="ri-group-fill text-2xl mr-3"></i>
            <span className="nav-text">People</span>
            <span className="text-xs ml-3 bg-purple-600 px-1 py-1 rounded-lg font-black text-white">Coming Soon</span>
            {isActive('/person') && (
              <div className="green-dot-container">
                <span className="green-dot"></span>
                <span className="ripple"></span>
              </div>
            )}
          </Link>
          
          <div className="p-2 w-full flex flex-col items-center">
      {isEditing || !recommendUrl ? (
        <div className="flex gap-1 w-full max-w-md">
          <input
            type="text"
            placeholder="Enter Recommendation URL"
            value={recommendUrl}
            onChange={(e) => setRecommendUrl(e.target.value)}
            className="border text-black border-gray-300 p-3 w-full rounded-lg focus:ring-4 focus:ring-blue-500 transition-all outline-none shadow-md"
          />
          <button
            onClick={handleSaveUrl}
            className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 transition-all shadow-md"
          >
            Save
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 justify-center">
          <a
            href={recommendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 bg-blue-500 text-white px-3 mt-1 py-2 rounded-lg hover:text-zinc-900 transition-all hover:scale-105"
          >
            <i className="fi fi-sr-artificial-intelligence text-2xl"></i>
            <span className="text-lg font-semibold -mt-1">Recommend</span>
          </a>
          <button
            onClick={() => setIsEditing(true)}
            className="border border-gray-500 px-4 py-2 rounded-lg  transition-all shadow-sm"
          >
            Edit
          </button>
        </div>
      )}
    </div>
        </nav>
        <button className='nav-item logout font-bold' onClick={handleLogout}>
          <i className="ri-logout-box-r-line text-2xl mr-3"></i>
          Logout
        </button>
      </div>
    </>
  );
}

export default SideNav;
