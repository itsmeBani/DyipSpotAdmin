import React from 'react';
import {Avatar, Card, List, ListItem, ListItemPrefix, Typography} from "@material-tailwind/react";
import {formatFirestoreDate} from "../functions/functions.js";
import useFetchRecentData from "../customHooks/useFetchRecentData.jsx";

function RecentRequest() {
    const { data: RecentRequestData, loading, error } = useFetchRecentData({
        collectionName: "Request",
        orderByField: "date",
        orderDirection: "desc",
        limitCount: 6,
    });
    return (




        <div className=" flex flex-col pt-0 p-10 pb-10 gap-4 h-full overflow-y-auto ">
            {RecentRequestData?.map((user)=> {
                return (


                    <div className="flex gap-3   border-b-2 last:border-b-0">


                            <img className=" rounded-full object-cover w-[40px] rounded-full object-cover h-[40px]" alt="candice"
                                 src={user.profilePictureUrl[0]}/>


                        <div className={""}>
                            <Typography  color="blue-gray" className={" whitespace-nowrap PlusJakartaSans-Bold text-[15px] "}>
                                {user.firstName +""+ user?.lastName}
                            </Typography>
                            <Typography variant="small" color={"blue-gray"} className="font-normal text-[12px] whitespace-nowrap">
                                for jeep tracking
                            </Typography>
                            <Typography variant="small" color={user?.status === "approved" ? "green" : user?.status === "pending" ? "orange": "red" } className="font-normal">
                                {user?.status}
                            </Typography>

                        </div>




                        <div color={"gray"} className="w-full flex flex-col text-end   PlusJakartaSans-Medium text-sm">
                            <Typography variant={"paragraph"} color={"gray"} className={"whitespace-nowrap text-sm PlusJakartaSans-Medium"}>Requested At</Typography>


                            <Typography variant={"paragraph"} color={"blue-gray"} className={"whitespace-nowrap text-sm PlusJakartaSans-Medium"}> {formatFirestoreDate(user?.date) }</Typography>

                        </div>

                    </div>
                )})}
        </div>



    );
}

export default RecentRequest;