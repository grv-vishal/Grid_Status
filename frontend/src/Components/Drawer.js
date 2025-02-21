import React,{useContext} from 'react'
import { FaAngleDoubleLeft } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi2";
import { TbLivePhoto } from "react-icons/tb";
import { TbReportSearch } from "react-icons/tb";
import { Link } from 'react-router-dom';
import { LuLogOut} from "react-icons/lu";
import { FaHome } from "react-icons/fa";

import { AppContext } from './Authentication/authProvider';



const Drawer = () => {
    const {setOpenDrawer,logoutHandler,loginState,openDrawer,Role}=useContext(AppContext);

  return (
    <div>
     <div className={`fixed left-0 top-17 z-50 h-screen w-64 bg-gray-100 flex flex-col gap-y-4 border-r-2 px-2
      transform transition-transform duration-300 ease-in-out ${
        openDrawer ? 'translate-x-0' : '-translate-x-full'}`}>
            
            <button className='flex justify-end items-center text-black text-3xl pt-4 pr-5' onClick={()=>setOpenDrawer(false)}>
                  <FaAngleDoubleLeft />
            </button> 
        
            <div className='w-full h-[2px] bg-gray-400'></div>

           
            <Link to="/">
                <button className='flex  flex-row justify-start pl-5 text-black text-[18px] sm:text-xl font-semibold items-center gap-x-4 w-full py-2 hover:shadow-md hover:bg-gray-400 transition-all duration-200'
                onClick={()=>setOpenDrawer(false)}>
                    <FaHome />
                    <p>Home</p>
                </button>
            </Link>
           
            {loginState &&
            <Link to={`${Role === 'operator' ? '/operatordashboard' : '/userdashboard'}`}>
                <button className='flex justify-start pl-5 items-center text-black text-[18px] sm:text-xl font-semibold gap-x-4 w-full py-2 hover:shadow-md hover:bg-gray-400 transition-all duration-200 '
                onClick={()=>setOpenDrawer(false)}>
                <TbLivePhoto />
                 <p>Live Dashboard</p> 
                </button>
            </Link>}

            {loginState && Role==="operator" &&
            <Link to="/dr-overview">
                <button className='flex justify-start pl-5 text-black text-[18px] sm:text-xl font-semibold items-center gap-x-4 w-full py-2 hover:shadow-md hover:bg-gray-400 transition-all duration-200'
                onClick={()=>setOpenDrawer(false)}>
                    <HiUserGroup />
                   <p>DR Overview</p>
                </button>
            </Link>
            }

            {/*loginState && Role==="operator" &&
            <Link to="/report">
                <button className='flex justify-start pl-5 text-black text-[18px] sm:text-xl font-semibold items-center gap-x-4 w-full py-2 hover:shadow-md hover:bg-gray-400 transition-all duration-200'
                onClick={()=>setOpenDrawer(false)}>
                    <TbReportSearch />
                   <p>Energy Report</p>
                </button>
            </Link>*/
            }

            {loginState && Role==="user" &&
            <Link to="/dr-participation">
                <button className='flex justify-start pl-5 text-black text-[18px] sm:text-xl font-semibold items-center gap-x-4 w-full py-2 hover:shadow-md hover:bg-gray-400 transition-all duration-200'
                onClick={()=>setOpenDrawer(false)}>
                    <HiUserGroup />
                   <p>DR Participation</p>
                </button>
            </Link>
            }

            
            <div className='w-full h-[1px] bg-gray-400'></div>


            {loginState && 
            <Link to="/logout">
              <button className='flex justify-start pl-5 text-redPink-2 text-[18px] sm:text-xl font-semibold items-center gap-x-4 w-full py-2 hover:shadow-md hover:bg-redPink-5 transition-all duration-200' onClick={() => {logoutHandler()}}>
               <LuLogOut />
               <p>Logout</p>
              </button>
            </Link>}    
      </div>

    </div>
  )
}

export default Drawer
