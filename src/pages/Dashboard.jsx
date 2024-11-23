import React from 'react';
import {StatisticsCard} from "../components/StatisticCard.jsx";

import {Typography} from "@material-tailwind/react";
import DriversTable from "../components/DriversTable.jsx";
import useFetchDriversOnce from "../customHooks/FetchDrivers.jsx";
import wheel from  "../assets/wheel.png"
import form from "../assets/form.png"
import {CheckCircleIcon, ClockIcon, UserCircleIcon,UsersIcon} from "@heroicons/react/24/solid";
import RecentPassengers from "../components/RecentPassengers.jsx";
import RecentRequest from "../components/RecentRequest.jsx";
function Dashboard(props) {

    const  {data}=useFetchDriversOnce("drivers")

    const {data:request}=useFetchDriversOnce("Request")
    const  {data:passengerData}=useFetchDriversOnce("users")
    return (
        <div className="p-5 w-full    gap-3 flex flex-col place-items-center ">
   
       <div className="flex flex-row bg-white p-5 rounded-xl shadow-sm  w-full gap-4  place-items-center ">
                <StatisticsCard iconbg={'orange'} bg={"bg-[#FFDE9C]"} color={null} icon={<img alt="" src={wheel}/> } value={data.length} title={"Total Drivers"}/>
                <StatisticsCard iconbg={"light-green"} bg={"bg-[#78FDA6]"} color={null} icon={<UsersIcon color="white" className="h-full w-full"/> } value={passengerData.length} title={"Total Passengers"}/>
                <StatisticsCard iconbg={"purple"} bg={"bg-[#CB9CFF]"} color={null} icon={<img alt="" src={form}/> }   value={request.length} title={"Total Request"}/>
       </div>

  
 
     <div className="flex w-full  gap-5">

         <div className="flex w-full p-3 bg-white rounded-xl  shadow-md ">

             <DriversTable/>


         </div>


         <div className="flex flex-col  gap-5 h-full rounded-xl place-items-center justify-center   ">

      <div className="flex-1 ">
<div className="overflow-hidden bg-white  p-4  pb-0 gap-5 shadow-md rounded-lg  h-[300px] flex flex-col ">


    <div className="flex flex-row pt-5 px-5 justify-center place-items-center gap-4">
    <UsersIcon color="white" className="h-[50px] w-[50px] rounded-md p-3 bg-gradient-to-tr from-light-green-600 to-light-green-400 "/>
    <Typography color="gray" variant={"h5"} className={"PlusJakartaSans-Bold whitespace-nowrap"}>
        Recent Passengers
    </Typography>
</div>
    <RecentPassengers />
</div>

           </div>



             <div className=" flex-1 w-full ">
                 <div className="overflow-hidden bg-white p-4  gap-5 shadow-md rounded-lg  h-[300px] flex flex-col ">

                     <div className="flex pt-5  px-5 flex-row justify-center place-items-center gap-4">
                         <img alt="" src={form} className="h-[50px] bg-[#CB9CFF] p-3 w-[50px] rounded-lg "/>
                         <Typography color="gray" variant={"h5"} className={"PlusJakartaSans-Bold"}>
                             Recent Requests
                         </Typography>
                     </div>
                     <RecentRequest RecentRequestData={request} />
                 </div>
             </div>







         </div>
     </div>
        </div>

    );
}

export default Dashboard;