import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import Cookies from 'js-cookie';
import toast from "react-hot-toast";

export const AppContext=createContext();

function AuthProvider({children}){

    const navigate=useNavigate();
    const[loginState,setloginState]=useState(false);
    const[gridLocation,setGridLocation]=useState("");
    const[userName,setUserName]=useState("");
    const[pvActual,setPvActual]=useState(null);
    const[pvForecast,setPvForecast]=useState(null)
    const[windActual,setWindActual]=useState(null);
    const[windForecast,setWindForecast]=useState(null);
    const[loadValue,setLoadValue]=useState(null);
    
    
    const initialData={
        username:"",
        password:"",
        role:"user",
        location:"Ghoramara",
    }
 

    const [loginData,setLoginData]=useState(initialData);
    const [Role,setRole]=useState('user');
    const[openDrawer,setOpenDrawer]=useState(false);

    // Login
    const loginHandler = async (loginData) => {
     try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
        credentials: 'include' // This enables cookies to be sent with the request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      //console.log("Login successful: ", data);
      //console.log('tokenuserName',getUsername());
      setloginState(true);
      setUserName(loginData.username);
      toast.success("Logged In Successfully");
      setGridLocation(loginData.location);

      // if(loginData.role !=="user"){
      //   setTimeout(() => {
      //     getDRParticipants();
      //   }, 1000);
      // }
      
      if (loginData.role === "user") {
        navigate('/userdashboard');
      } else {
        navigate('/operatordashboard');
      }

      setLoginData(initialData);

      //localStorage.setItem('token', data.accessToken);
      //console.log('login',data.accessToken);

     } catch (error) {
      console.log("Error found: ", error.message);
      toast.error(error.message);
     }
    };


    // Logout
    const logoutHandler = async () => {
     try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include' // This enables cookies to be sent with the request
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      //console.log("Logout successful: ", data);
      setloginState(false);
      setOpenDrawer(false);
      toast.success("Logged Out Successfully");
      navigate('/login');

     } catch (error) {
      console.log("Error found: ", error.message);
      toast.error(error.message);
     }
    };



    //API response
    useEffect(() => {
      const fetchData = async () => {
        try {

          //solar data fetch
          const solarActual = await fetch(`http://localhost:5000/api/energy/get/${gridLocation}/solar/actual`,{
            method:'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!solarActual.ok) {
            throw new Error('Failed to fetch actual data');
          }

          const resultSolarActual = await solarActual.json();

          const solarForecast = await fetch(`http://localhost:5000/api/energy/get/${gridLocation}/solar/predicted`,{
            method:'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!solarForecast.ok) {
            throw new Error('Failed to fetch forecast data');
          }

          const resultSolarForecast = await solarForecast.json();

          //wind data fetch
          const windActual = await fetch(`http://localhost:5000/api/energy/get/${gridLocation}/wind/actual`,{
            method:'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!windActual.ok) {
            throw new Error('Failed to fetch wind actual data');
          }

          const resultWindActual = await windActual.json();

          const windForecast = await fetch(`http://localhost:5000/api/energy/get/${gridLocation}/wind/predicted`,{
            method:'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          if (!windForecast.ok) {
            throw new Error('Failed to fetch wind forecast data');
          }

          const resultWindForecast = await windForecast.json();

          //Load Energy Fetch
          const loadEnergy = await fetch(`http://localhost:5000/api/energy/get/${gridLocation}/load`,{
            method:'GET',
            credentials:'include',
            headers: {
              'Content-Type': 'application/json',
            }
          });

          const resultLoadEnergy= await loadEnergy.json();

          console.log(resultSolarActual.data);
          console.log(resultSolarForecast.data);

          //Solar data Update
          if (resultSolarActual.success && resultSolarForecast.success) {
            setPvActual(resultSolarActual.data);
            setPvForecast(resultSolarForecast.data);
          } else {
            console.error('Failed to fetch data:', resultSolarActual.message,resultSolarForecast.message);
          }

          //Wind data Update
          if (resultWindActual.success && resultWindForecast.success) {
            setWindActual(resultWindActual.data);
            setWindForecast(resultWindForecast.data);
          } else {
            console.error('Failed to fetch data:', resultWindActual.message,resultWindForecast.message);
          }

          //Load Energy Value Update
          if(resultLoadEnergy.success){
            setLoadValue(resultLoadEnergy.data);
          }
          else{
            console.error('Failed to fetch data:', resultLoadEnergy.message);
          }

        } 
        catch (err) {
          console.error('Failed to fetch energy Data', err);
        }
      };

      // Fetch the latest predictions when the component mounts
      fetchData();
    }, [gridLocation]);




  //Battery SOC Calculation


  const[batteryPower,setBatteryPower]=useState([]); //having values in battery SOC %
  const[criticalDR,setCriticalDR]=useState([]);
  const[battPercent,setbattPercent]=useState(null); // for current battery status
  const[totalLoad,setTotalLoad]=useState(null);
  const[totalGen,setTotalGen]=useState(null);
  let times ;

  if(loadValue){
    times = loadValue.map((dataPoint) => dataPoint.hour);
  }
   
  useEffect(() => {

    if(pvActual && windActual && loadValue){
 
      // Extract the first 24 datapoints for PV and Wind Actual and Load values
      const pvValues = pvActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
      const windValues = windActual.slice(-24).map((dataPoint) => dataPoint.actualValue);
      const loadValues = loadValue.map((dataPoint) => dataPoint.total_Load);

      // Calculate total generation (PV + Wind) for each time point
      const totalGeneration = pvValues.map((pv, index) => pv + windValues[index]);
      const difference = totalGeneration.map((gen,index) => gen - loadValues[index]);
      const mode = difference.map((val) => (val < 0 ? 'Discharging' : 'Charging'));


      //Calculate Battery status
      const battery_const=705.6
      const initial_power=(0.5*battery_const);
      const min_power=(0.2*battery_const);
      const max_power=(0.9*battery_const);
      let batt_status=initial_power;
      const battery_percent=[];
      let batt_SOC=(initial_power*100)/battery_const
      const battery_power = [];
      let critical_DR=[];
      let percent;

      for(let i=0; i<=23;i++){

       if (mode[i] === 'Discharging' && batt_status >= min_power && batt_status<=max_power) {
         batt_status += difference[i];
       } else if (mode[i] === 'Charging' && batt_status <= max_power){
         batt_status += difference[i];
       }
       if (batt_status > max_power) 
         batt_status = max_power;

       batt_SOC=(batt_status*100)/battery_const;
       battery_percent.push(batt_SOC);

       battery_power.push(batt_status);

       critical_DR.push(batt_status < min_power ? 1 : 0);

       //current battery status
       if(i===17){
         percent=parseFloat(((batt_status*100)/battery_const).toFixed(2));
       }   

      }

      //const percent=parseFloat(((batt_status*100)/battery_const).toFixed(2));
      // Calculate total load and total generation
      const load = parseFloat(loadValues.reduce((acc, curr) => acc + curr, 0).toFixed(2));
      const gen = parseFloat(totalGeneration.reduce((acc, curr) => acc + curr, 0).toFixed(2));

      setBatteryPower(battery_percent);
      setCriticalDR(critical_DR);
      setbattPercent(percent);
      setTotalGen(gen);
      setTotalLoad(load);

    }
    },[pvActual, windActual, loadValue]);




    //Demand Response Scheduling
    const initialiseSchedule={
      timeSlot:"",
      responseMethod:"LS",
      incentive:"",
    }
    const [DRScheduling,setDRScheduling] = useState(initialiseSchedule);


    //calculating incentive 
    useEffect(() => {
     if (DRScheduling.timeSlot && DRScheduling.responseMethod) {
      const slot = DRScheduling.timeSlot;
      const method = DRScheduling.responseMethod;
      let incen = 0;
  
      if (criticalDR[slot] === 0 && method === 'LR') {
        incen = 1;
      } else if (criticalDR[slot] === 0 && method === 'LS') {
        incen = 0.5;
      } else if (criticalDR[slot] === 1 && method === 'LR') {
        incen = 2;
      } else {
        incen = 1;
      }
  
      setDRScheduling((prev) => ({
        ...prev,
        incentive: `${incen}`,
      }));
     }
    }, [DRScheduling.timeSlot, DRScheduling.responseMethod,criticalDR]);



    //posting Demand Response Scheduling to the backend server
    const postDRScheduling = async (DRScheduling) => {
      try {
        
        // const userId = getUsername();

        // Make a POST request to the backend server
        const response = await fetch(`http://localhost:5000/api/demand-response/post/${gridLocation}/${userName}/dr-scheduling`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Specify JSON data
          },
          credentials: 'include', // Include cookies for authentication if required
          body: JSON.stringify(DRScheduling), // Convert the object to JSON
        });

        const data = await response.json();

        if (!response.ok) {
         throw new Error(data.message || 'Failed to Schedule, please try again.');
        }

        // If successful
        console.log('DR Scheduling posted successfully:', data);
        toast.success('Thank you for participating!');
      } catch (error) {
        console.error('Error posting DR Scheduling:', error.message);
        toast.error(error.message || 'Failed to Schedule, Try Again.');
      }
    };



    //Get User Demand Response Scheduling Data from the api server
    const[userDR,setUserDR]=useState(null);
    const getDRScheduling = async() => {
      try{

        const response = await fetch(`http://localhost:5000/api/demand-response/get/${gridLocation}/${userName}/dr-scheduling`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json', 
          }     
        });

        const DRdata = await response.json();

        if(DRdata.success){
          setUserDR(DRdata.data);
        }
        else{
          throw new Error('Failed to fetch data');
        }
      }
      catch(error){
        toast.error(error.message);
      }
    }



    //Total USer Participants in Demand Response
    const[DRParticipant,setDRParticipant]=useState(null);
    const[refresh,setRefresh]=useState(false);

    useEffect(() =>{

      const getDRParticipants = async(req,res) => {
        try{
          console.log("Fetching DR participants for gridLocation:", gridLocation);
  
          const response = await fetch(`http://localhost:5000/api/demand-response/get/Ghoramara/dr-participants`, {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Content-Type': 'application/json', 
            }     
          });

          console.log("Response Status:", response.status);
          const DRdata = await response.json();
          console.log("Parsed Response:", DRdata);
  
          if(DRdata.success){
            setDRParticipant(DRdata.data);
          }
          // else{
          //   throw new Error('Failed to fetch users participation data');
          // }
        }
        catch(error){
          toast.error(error.message);
        }
      }

      getDRParticipants();
    },[refresh,gridLocation])
      
    
    const value={
        loginState,
        setloginState,
        loginData,
        setLoginData,
        Role,
        setRole,
        loginHandler,
        logoutHandler,
        openDrawer,
        setOpenDrawer,
        gridLocation,
        setGridLocation,
        pvActual,
        pvForecast, 
        windForecast,
        windActual,
        loadValue,
        batteryPower,
        criticalDR,
        times,
        battPercent,
        totalGen,
        totalLoad,
        DRScheduling,
        setDRScheduling,
        initialiseSchedule,
        postDRScheduling,
        getDRScheduling,
        userDR,
        DRParticipant,
        refresh,
        setRefresh
    };

    return (
        <AppContext.Provider value={value}>
          {children}
        </AppContext.Provider>
    )
};

export default AuthProvider

