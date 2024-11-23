import {Card, CardBody, CardFooter, CardHeader, IconButton, Typography} from "@material-tailwind/react";
import {CheckCircleIcon, ClockIcon, UserCircleIcon,UsersIcon} from "@heroicons/react/24/solid";

export function StatisticsCard({color,bg,iconbg, icon, title, value, footer}) {
    return (
        <div className={` ${bg} w-full p-4 rounded-xl  shadow-sm`}>
            <div
                className="flex w-full gap-10 justify-between">
                <IconButton variant="gradient" color={iconbg} className={`bg-['#FFFFFF'] p-[30px]  `} >
                    {icon}
                </IconButton>
              <div className="flex flex-col  place-items-end w-full">
                    <Typography variant="small" className="font-normal text-[#425166] PlusJakartaSans-Medium  whitespace-nowrap ">
                      {title}
                  </Typography>
                    <Typography variant="h4" color="white " className="flex PlusJakartaSans-Bold text-[#425166]  place-items-center whitespace-nowrap justify-end text-end">
                      {value}
                  </Typography>

              </div>
            </div>
            {/*<CardBody className="p-4 text-right">*/}

            {/*    <Typography variant="h4" color="blue-gray">*/}
            {/*        {value}d*/}
            {/*    </Typography>*/}
            {/*</CardBody>*/}
            {/*{footer && (*/}
            {/*    <CardFooter className="border-t border-blue-gray-50 p-4">*/}
            {/*        {footer}d*/}
            {/*    </CardFooter>*/}
            {/*)}*/}
        </div>
    );
}