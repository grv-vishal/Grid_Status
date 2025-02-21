import React,{useContext, useEffect} from 'react';
import { LoadGraph, PvGraph, WindGraph,TotalGenerationGraph, DifferenceGraph, SocGraph } from '../../Components/EnergyPlot/Graph';
import { AppContext } from '../../Components/Authentication/authProvider';


const OperatorDashboard = () => {
  const{openDrawer,totalGen,totalLoad,battPercent}=useContext(AppContext);

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
     <div className='flex flex-row w-full gap-x-6 justify-center items-center px-6 pt-6'>
      <div className='border border-gray-300 rounded-lg shadow-lg p-5 w-full flex flex-col justify-start'>
        <p className='text-2xl font-bold'>Generation <span className='font-medium'>(Last 24 hour)</span></p>
        <div className='text-xl font-medium'>{totalGen}  KW</div>
      </div>
      <div className='border border-gray-300 rounded-lg shadow-lg p-5 w-full flex flex-col justify-start'>
        <p className='text-2xl font-bold'>Load <span className='font-medium'>(Last 24 hour)</span></p>
        <div className='text-xl font-medium'>{totalLoad}  KW</div>
      </div>
      <div className='border border-gray-300 rounded-lg shadow-lg p-5 w-full flex flex-col justify-start'>
        <p className='text-2xl font-bold'>Current Battery Status</p>
        <div className='text-xl font-medium'>{battPercent}  %</div> 
      </div>
     </div>

     <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 p-6 w-full">

      {/* Static Graph */}
      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <PvGraph/>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <WindGraph/>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <LoadGraph/>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <TotalGenerationGraph/>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <DifferenceGraph/>
      </div>

      <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-full h-full min-h-[450px]">
        <SocGraph/>
      </div>
     </div>

    </div>
  );
};

export default OperatorDashboard;
