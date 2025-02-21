import React,{useEffect,useContext,useState} from 'react'
import { CriticalDRGraph } from '../../Components/EnergyPlot/Graph'
import { AppContext } from '../../Components/Authentication/authProvider';
import { RxCross2 } from "react-icons/rx";
import toast from 'react-hot-toast'

const DRParticipation = () => {
    const{openDrawer,postDRScheduling,DRScheduling,setDRScheduling,initialiseSchedule,userDR,getDRScheduling}=useContext(AppContext);
    const [isDResponseOpen, setIsDResponseOpen] = useState(false);
    const [isConfirmed,setIsConfirmed] =useState(false);
    const [response,setResponse] = useState('LS');
    
    const [isHistoryOpen,setIsHistoryOpen] = useState(false);
    
    // const initialiseSchedule={
    //   timeSlot:"",
    //   responseMethod:"LS",
    //   incentive:"",
    // }
    // const [DRScheduling,setDRScheduling] = useState(initialiseSchedule);



    //DR participation Hour
    const currTime = 17;
    const [availableHours, setAvailableHours] = useState([]);

    useEffect(() => {
      let hours = [];
      let currHour = currTime;
      for (let i = 0; i < 6; i++) {
        currHour++;
        hours.push(currHour);
      }
  
      // Dynamically filter hours based on `userDR`
      const filteredHours = userDR
        ? hours.filter((hour) => !userDR.some((entry) => entry.timeSlot === hour))
        : hours;
  
      setAvailableHours(filteredHours);
    }, [userDR,isDResponseOpen,isHistoryOpen]); // Re-run the effect whenever `userDR` change
    


  useEffect(() => {
    // Trigger window resize event when drawer toggless
    const handleResize = () => {
      window.dispatchEvent(new Event('resize'));
    };
    
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, [openDrawer]);

  
  //submiting the scheduling
  const onClickHandler = async() => {
    if (!DRScheduling.timeSlot || !DRScheduling.responseMethod) {
      toast.error("Please select all required fields .");
        return;
    }
    
    setIsDResponseOpen(false);
    setIsConfirmed(false);
    console.log(DRScheduling);
    postDRScheduling(DRScheduling);
    setDRScheduling(initialiseSchedule);
    //toast.success('Thank you for participating!');
  }



  return (
    <div className='flex flex-col justify-center gap-y-5 p-6 w-full'>

     <div className="border border-gray-300 rounded-lg shadow-lg p-2 w-1/2 h-full min-h-[450px] mx-8 ">
      <CriticalDRGraph/>
     </div>

     <div className='flex flex-row justify-between items-center border border-gray-300 rounded-lg shadow-lg py-2 px-6 mx-8 gap-x-4'>
        <p className='font-semibold text-2xl'>Demand Response Participation <span className='font-light text-lg'>( If you want to Participate in DR, click on 'Participate' )</span></p>
         <button
         className="bg-blue-500 text-white font-semibold px-4 py-2 rounded mt-2 hover:bg-blue-600"
         onClick={() => setIsDResponseOpen(true)}
         >Participate</button>
        
     </div>

     <div className='flex flex-row justify-between items-center border border-gray-300 rounded-lg shadow-lg py-2 px-6 mx-8 gap-x-4'>
        <p className='font-semibold text-2xl'>Demand Response Participation History</p>
         <button
         className="bg-blue-500 text-white font-semibold px-4 py-2 rounded mt-2 hover:bg-blue-600"
         onClick={() => {
          setIsHistoryOpen(true)
          getDRScheduling()
         }}
         >View</button>
        
     </div>


     {/* DR participation Dialog Box */}
     {isDResponseOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/3 w-2/3">
            <h2 className="text-xl font-bold mb-4">Confirm Scheduling</h2>

            <div>
              <label htmlFor="timeSlot" className="block mb-2 font-semibold">Select Time Slot for the Next 6 Hours</label>
              <select 
              id="timeSlot" 
              className="w-full border border-gray-300 rounded px-3 py-2"
              required
              onChange={(e) => {
                e.preventDefault();
                setDRScheduling((prev) => ({
                  ...prev,
                  timeSlot:e.target.value
                }))
              }} // You can handle the selection here
              >
             <option value="" disabled selected>Select a time slot</option>
             {availableHours.map((time, index) => (
               <option key={index} value={time}>
                 {`${time}:00 - ${time + 1}:00`}
               </option>
             ))}
             </select>
            </div>


            {/*selecting the response method*/}
            <div className='flex flex-row gap-x-4 text-xl my-4 font-semibold'>
              <button className={`${response==='LS'? "text-white bg-gray-950" : " "} border px-3 py-1 rounded-md`}
              onClick={(e) =>{
                e.preventDefault();
                setResponse('LS');
                setDRScheduling((prev) => ({
                  ...prev,
                  responseMethod:"LS"
                }))
              }}
              >Load Shedding</button>
              <button className={`${response==='LR'? " text-white bg-gray-950" : " "} border px-3 py-1 rounded-md`}
              onClick={(e) =>{
                e.preventDefault();
                setResponse('LR');
                setDRScheduling((prev) => ({
                  ...prev,
                  responseMethod:"LR"
                }))
              }}
              >Load Reducing</button>
            </div>


            <div className="my-4">
              <div className="flex items-center">
                <input 
                 id="confirmParticipation" 
                 type="checkbox" 
                 className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                 onChange={(e) => setIsConfirmed(e.target.checked)} // Handle checkbox state
                />
                <label 
                 htmlFor="confirmParticipation" 
                 className="ml-2 text-gray-700"
                >
                I confirm my participation in the selected time slot.
                </label>
              </div>
            </div>
            
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-600"
                onClick={() => setIsDResponseOpen(false)}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  isConfirmed ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-400 text-white cursor-not-allowed'
                }`}
                disabled={!isConfirmed && !DRScheduling.timeSlot} // Disable button until checkbox is checked
                onClick={onClickHandler}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}


      {/*DR participation History*/}
      {isHistoryOpen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/2 w-2/3 relative">
            <div 
            className='absolute text-gray-400 text-xl font-bold right-2 top-2 cursor-pointer hover:text-white hover:bg-red-400 p-1 transition-all duration-400'
            onClick={() => setIsHistoryOpen(false)}
            >
            <RxCross2 />
            </div>
            <h2 className='text-2xl text-center font-bold mb-4'>Demand Response Participation History</h2>

            {/*History*/}
            <div className='max-h-72 overflow-y-auto'>

              {userDR && userDR.length > 0 ? (
                <table className='w-full border-collapse border border-gray-300 text-center'>
                  <thead>
                    <tr className='bg-gray-200'>
                     <th className='border border-gray-300 px-4 py-2'>Time Slot</th>
                     <th className='border border-gray-300 px-4 py-2'>Response Method</th>
                     <th className='border border-gray-300 px-4 py-2'>Incentive (Rs.)</th>
                    </tr>
                  </thead>
                  <tbody>
                   {userDR.map((DR, i) => (
                    <tr key={i} className='hover:bg-gray-100'>
                     <td className='border border-gray-300 px-4 py-2'>{DR.timeSlot}:00 - {DR.timeSlot+1}:00</td>
                     <td className='border border-gray-300 px-4 py-2'>{DR.response === 'LR' ? 'Load Reducing' : 'Load Shedding'}</td>
                     <td className='border border-gray-300 px-4 py-2'>{DR.incentive}</td>
                    </tr>
                   ))}
                  </tbody>
                </table>
              ) : (
              <p className='text-gray-500 text-center'>No participation history available.</p>
              )}
            </div>
          </div>

        </div>
      )}
        
      
    </div>
  )
}

export default DRParticipation
