import React,{useEffect,useContext,useState} from 'react'
import { CriticalDRGraph } from '../../Components/EnergyPlot/Graph'
import { AppContext } from '../../Components/Authentication/authProvider';
import { LuRefreshCw } from "react-icons/lu";

const DROverview = () => {
  const{openDrawer,DRParticipant,refresh,setRefresh}=useContext(AppContext);

  useEffect(() => {
    // Trigger window resize event when drawer toggless
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [openDrawer]);


  const [isRotating, setIsRotating] = useState(false);

  const handleRefreshClick = (e) => {
    e.preventDefault();
    setIsRotating(true); // Start rotating
    setTimeout(() => {
      setIsRotating(false); // Stop rotating after 1 second
    }, 1000);
    setRefresh(!refresh);
  };

  return (
    <div className='p-6 w-full mb-10'>

     <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-1/2 h-full min-h-[450px] ">
      <CriticalDRGraph/>
     </div>

     {/*DR participants*/}
     <div className='overflow-x-auto mt-8'>
      <div className='flex flex-row gap-x-4 mt-4 justify-start items-center'>
       <h2 className='text-3xl font-semibold '> Users Participation in Demand Response </h2>
       <button className='text-xl mt-3' onClick={handleRefreshClick}>
        <LuRefreshCw 
        className={`transition-transform duration-1000 ${isRotating ? 'rotate-360' : ''}`}
        />
       </button>
      
      </div>
      
     {DRParticipant && DRParticipant.length > 0 ? (
        <table className="w-full border-collapse border border-gray-300 text-center my-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Time Slot</th>
              <th className="border border-gray-300 px-4 py-2">Username</th>
              <th className="border border-gray-300 px-4 py-2">Response Method</th>
            </tr>
          </thead>
          <tbody>
            {DRParticipant.map((slot, i) => (
              <React.Fragment key={i}>
                <tr className="bg-gray-100">
                  <td
                    className="border border-gray-300 px-4 py-2 font-semibold"
                    rowSpan={slot.participants.length + 1}
                  >
                    {slot.timeSlot}:00 - {slot.timeSlot + 1}:00
                  </td>
                </tr>
                {slot.participants.map((participant, j) => (
                  <tr key={j}>
                    <td className="border border-gray-300 px-4 py-2">{participant.username}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {participant.response === 'LR' ? 'Load Reducing' : 'Load Shedding'}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600 text-center my-6 text-md">No DR participants available.</p>
      )}
     </div>
        
      
    </div>
  )
}

export default DROverview
