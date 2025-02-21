import React,{useContext,useEffect,useState} from 'react'
import {Link} from 'react-router-dom';
import { FaAlignLeft } from "react-icons/fa";
import { IoLocationOutline } from "react-icons/io5";
import { AppContext } from './Authentication/authProvider';
import AppMenu from './AppMenu';
import moment from 'moment'


const Navbar = () => {

  const {loginState,Role,openDrawer,setOpenDrawer,gridLocation}=useContext(AppContext);
  const [currentTime, setCurrentTime] = useState(moment().format('h:mm:ss a'));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment().format('h:mm:ss a'));
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (

    <div className='sticky top-0 z-50'>
      <div className= {`flex px-4 [@media(min-width:600px)]:px-6 items-center py-3 bg-white shadow-lg justify-between `}>

        <div className="flex flex-row justify-center items-center gap-x-5"> 
        {loginState &&
        <button className={`${loginState ? "flex flex-col gap-y-2" : "flex flex-col gap-y-2 "}`} onClick={()=>{
          if(openDrawer)
            setOpenDrawer(false);
          else
            setOpenDrawer(true);
         }}>
         <FaAlignLeft className='text-black text-4xl' />
        </button>}

        <div>
          <h2 className='text-black text-2xl font-bold'>GreenGrid<span className='text-sm font-bold'>.Status</span></h2>

        </div>

       </div>   
   
        <div className='flex flex-row justify-center items-center gap-2 mx-5'>

        {/*loginState &&
          <div className='flex flex-row justify-center items-center gap-1 text-xl text-black font-semibold '>
            <h2>{currentTime}</h2>
          </div>*/

        }

        {loginState &&
          <div className='flex flex-row justify-center items-center gap-1 text-xl text-black font-semibold '>
            <IoLocationOutline />
            <h2>{gridLocation}</h2>
          </div>

        }
        {!loginState &&
        <Link to="/login">
         <button className=" text-black font-bold py-1 px-4 text-xl  hover:bg-white transition-all duration-400
         hover:text-blue-700">
         Log In
         </button>
        </Link>}

        {loginState && Role==='user' &&
        <Link to="">
          <AppMenu/>
        </Link>} 

        </div>
        

      </div>


    </div>
    
  )
}

export default Navbar
