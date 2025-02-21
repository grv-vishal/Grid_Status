import {useContext} from 'react';
import './App.css';
import { Route,Routes } from 'react-router-dom';


import Navbar from './Components/Navbar';
import Login from './Pages/login';
import UserDashboard from '../src/Pages/UserSection/userDashboard'
import OperatorDashboard from './Pages/OperatorSection/operatorDashboard';
import Home from './Pages/home'
import PrivateRoute from './Components/PrivateRoute';
import Drawer from './Components/Drawer';
import { AppContext } from './Components/Authentication/authProvider';
import DROverview from './Pages/OperatorSection/DROverview';
import DRParticipation from './Pages/UserSection/DRParticipation';


function App() {

  //const [actualData,setActualData]=useState(null);
  const {openDrawer,loginState} =useContext(AppContext);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await axios.get('http://localhost:4000/api/getData');
  //       const result = await res.data;

  //       if (result.success) {
  //         setActualData(result.data);
  //       } else {
  //         console.error('Failed to fetch data:', result.message);
  //       }
  //     } 
  //     catch (err) {
  //       console.error('Failed to fetch energy Data', err);
  //     }
  //   };

  //   // Fetch the latest predictions when the component mounts
  //   fetchData();
  // }, []);


   
  return (
    <div className="relative w-[100vw] h-[100vh] overflow-x-hidden ">
        {loginState &&
          <Navbar/>
        }

        {!loginState &&
          <Login/>
        }
         
         <div className={`${openDrawer===true ? "flex flex-row relative lg:flex-grow lg:ml-64" : ""}`}>
        {openDrawer &&
          <Drawer/>
        }

         <Routes>
         <Route path='/login' element={<Login/>}/>
         <Route path='/' element={<Home/>}/>
         <Route path='/dr-overview' element={
          <PrivateRoute>
            <DROverview/>
          </PrivateRoute>  
          }/>
          <Route path='/dr-participation' element={
          <PrivateRoute>
            <DRParticipation/>
          </PrivateRoute>  
          }/>
         <Route path='/userdashboard' element={
          <PrivateRoute>
            <UserDashboard/>
          </PrivateRoute>  
          }/>
         <Route path='/operatordashboard' element={
          <PrivateRoute>
             <OperatorDashboard/>
          </PrivateRoute>   
          }/>
         </Routes>
        </div> 

      
    </div>
  );
}

export default App;
