import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiArrowLeftLine } from 'react-icons/ri';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-hot-toast';
import { AuthContext } from "../../context/AuthContext";

gsap.registerPlugin(ScrollTrigger);

function SignUp() {
  const navigate = useNavigate();
  const { signup } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        await signup({ userName, firstName, lastName, emailId: email, password });
        toast.success("Signup successful!");
    } catch (error) {
        toast.error(error.message);
    }
};

  const formRef = useRef(null);
  const headingRef = useRef(null);
  const bgImageRef = useRef(null);
  const infoRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
    
    tl.fromTo(bgImageRef.current, { opacity: 0, scale: 1.2 }, { opacity: 1, scale: 1, duration: 2 });
    tl.fromTo(infoRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1.5 }, '-=1.5');
    tl.fromTo(headingRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.5 }, '-=1.5');
    gsap.fromTo([formRef.current, buttonRef.current], { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, stagger: 0.2, scrollTrigger: { trigger: formRef.current, start: 'top 80%' } });
  }, []);

  return (
    <div ref={bgImageRef} className="relative w-full h-screen flex items-center justify-center text-white bg-cover bg-center" style={{ backgroundImage: 'url("https://wallpaperaccess.com/full/3034392.jpg")' }}>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-20">
        <h1 className="text-3xl font-bold flex items-center">
          <RiArrowLeftLine onClick={() => navigate(-1)} className="text-2xl cursor-pointer hover:text-blue-500 transition-transform transform hover:-translate-x-1" />
        </h1>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold hidden md:flex">Already have an account?</span>
          <Link to="/" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">Vybe in</Link>
        </div>
      </div>

      <div ref={infoRef} className="z-20 text-center space-y-6 p-6">
        <h1 ref={headingRef} className="text-4xl font-extrabold relative inline-block group">
          <span className="relative z-10">Unlimited movies, TV shows, and more</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-110 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></span>
        </h1>
        <h2 className="text-2xl font-semibold">Watch anywhere. Stream anytime.</h2>
        <h2 className="text-lg">Ready to watch? Enter your details to create an account.</h2>
        <form onSubmit={handleSubmit} ref={formRef} className="mt-6 space-y-4 w-full max-w-md mx-auto p-6 rounded-lg bg-opacity-0 backdrop-blur-xs border border-gray-600">
          <input type="text" placeholder="Username" className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400" value={userName} onChange={(e) => setUserName(e.target.value)} required />
          <input type="text" placeholder="First Name" className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          <input type="text" placeholder="Last Name" className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          <input type="email" placeholder="Email address" className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" className="w-full p-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-400" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button ref={buttonRef} type="submit" className="w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all transform hover:scale-105">Get Started</button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;