import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
    ListItemSuffix,
    Chip,
    Accordion,
    AccordionHeader,
    AccordionBody,
} from "@material-tailwind/react";
import {
    PresentationChartBarIcon,
    ShoppingBagIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    InboxIcon,
    UserGroupIcon,
    PowerIcon,
} from "@heroicons/react/24/solid";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import  logo from  "../assets/logo.png"
import useFetchDriversOnce from "../customHooks/FetchDrivers.jsx";
export function Sidebar() {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
        setOpen(open === value ? 0 : value);
    };
    const { data,setrefresh,refresh } = useFetchDriversOnce("Request");
    return (
        <Card className="h-full rounded-r-lg rounded-l-none  w-auto max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="mb-2  p-4">
                <p  className= "text-[#3083FF] font-bold ">
                    <img src={logo} className="w-[10rem]"/>
                </p>
            </div>
            <List>

                <Link to={"/dashboard"}>


                    <ListItem>
                        <ListItemPrefix>
                            <PresentationChartBarIcon className="h-5 w-5" />
                        </ListItemPrefix>


                        <Typography color="blue-gray" className="mr-auto font-normal">
                            Dashboard
                        </Typography>
                    </ListItem>
                </Link>

                <Link to={"/request"}>


                <ListItem>
                    <ListItemPrefix>
                        <InboxIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Request
                    <ListItemSuffix>
                        <Chip value={data.length} size="sm" variant="ghost" color="green" className="rounded-full" />
                    </ListItemSuffix>
                </ListItem>
                </Link>
           {/*<Link to={"/passengers"}>*/}



           {/*    <ListItem>*/}
           {/*        <ListItemPrefix>*/}
           {/*            <UserGroupIcon className="h-5 w-5" />*/}
           {/*        </ListItemPrefix>*/}
           {/*        Passengers*/}
           {/*    </ListItem>*/}
           {/*</Link>*/}

           {/*     <Link to={"/drivers"}>*/}
           {/*         <ListItem>*/}
           {/*             <ListItemPrefix>*/}
           {/*                 <UserCircleIcon className="h-5 w-5" />*/}
           {/*             </ListItemPrefix>*/}
           {/*             Drivers*/}
           {/*         </ListItem>*/}
           {/*     </Link>*/}
                <ListItem>
                    <ListItemPrefix>
                        <PowerIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Log Out
                </ListItem>
            </List>
        </Card>
    );
}