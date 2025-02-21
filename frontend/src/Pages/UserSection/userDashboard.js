import React,{useContext, useEffect} from 'react';
import { LoadGraph, PvGraph, WindGraph,TotalGenerationGraph} from '../../Components/EnergyPlot/Graph';
import { AppContext } from '../../Components/Authentication/authProvider';


const UserDashboard = () => {
  const{openDrawer}=useContext(AppContext);

  useEffect(() => {
    // Trigger window resize event when drawer toggles
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [openDrawer]);

  return (
    <div className='w-full'>
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 p-6 w-full">
      {/* Container for PV Graph */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px] ">
        <PvGraph/>
      </div>

      {/* Container for Wind Graph */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <WindGraph/>
      </div>
      
      {/*Container for Load Graph */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <LoadGraph/>
      </div>

      {/*Container for Total Gen Graph */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <TotalGenerationGraph/>
      </div>

     </div>

    </div>
  )
}

export default UserDashboard
