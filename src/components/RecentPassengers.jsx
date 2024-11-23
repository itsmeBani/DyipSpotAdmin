import React, {useEffect, useState} from 'react';
import {Avatar, Card, List, ListItem, ListItemPrefix, Typography} from "@material-tailwind/react";
import {db} from "../../api/firebase-config.js";
import {collection, getDocs, query,orderBy,limit} from "firebase/firestore";
import {formatFirestoreDate} from "../functions/functions.js";
import useFetchRecentData from "../customHooks/useFetchRecentData.jsx";

function RecentPassengers() {

    const { data: passengerData, loading, error } = useFetchRecentData({
        collectionName: "users",
        orderByField: "CreatedAt",
        orderDirection: "desc",
        limitCount: 6,
    });


    return (




                <div className=" flex flex-col pt-0 p-10 pb-10 gap-4 h-full overflow-y-scroll ">
                    {passengerData?.slice(0,5).map((user)=> {
                        return (


                            <div className="flex gap-3 justify-between w-full  border-b-2 last:border-b-0 pb-1">

                       <div className="flex gap-2">
                           <div className="w-[40px] rounded-full object-cover h-[40px]">
                               <img className=" rounded-full object-cover" alt="candice"
                                    src={user?.ImageUrl}/>

                           </div>
                           <div className={""}>
                               <Typography  color="blue-gray" className={" whitespace-nowrap PlusJakartaSans-Medium text-[15px] "}>
                                   {user.first}
                               </Typography>
                               <Typography variant="small" color={user?.status === "online" ? "green" : user?.status === "waiting" ? "orange": "red" } className="font-normal">
                                   {user?.status}
                               </Typography>
                           </div>
                       </div>

                               <div color={"gray"} className="w-full flex flex-col text-end   PlusJakartaSans-Medium text-sm">
                                     <Typography variant={"paragraph"} color={"gray"} className={"whitespace-nowrap text-sm PlusJakartaSans-Medium"}>Created At</Typography>


                                   <Typography variant={"paragraph"} color={"blue-gray"} className={"whitespace-nowrap text-sm PlusJakartaSans-Medium"}> {formatFirestoreDate(user?.CreatedAt) }</Typography>
                               </div>
                        </div>
                            )})}
                </div>



    );
}

export default RecentPassengers;