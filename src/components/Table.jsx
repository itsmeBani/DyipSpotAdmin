import { PencilIcon } from "@heroicons/react/24/solid";
import {
    ArrowDownTrayIcon,
    MagnifyingGlassIcon,
    EllipsisHorizontalIcon,
    EyeDropperIcon,
    EyeIcon,
    FolderOpenIcon,
    CheckBadgeIcon
} from "@heroicons/react/24/outline";
import {
    Card,
    CardHeader,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Avatar,
    IconButton,
    Tooltip,
    Input,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter, Carousel,
} from "@material-tailwind/react";
import React, {useEffect, useState} from "react";
import {db} from "../../api/firebase-config.js";

const TABLE_HEAD = ["Profile", "Name", "Address", "For Hire" ,"Status",  "Jeep images", "action "];
import { collection, onSnapshot,query,where,updateDoc ,getDocs} from 'firebase/firestore';
import {getUserDocRefById} from "../functions/functions.js";
import {ArrowLeftIcon, ArrowRightIcon, XMarkIcon} from "@heroicons/react/24/outline/index.js";
import wheel from "../assets/wheel.png"
import form from "../assets/form.png"
export default function ManageRequestDrivingTracking() {
    const [data, setData] = useState([]);
    const [searchText, setSearchText] = useState(""); // New state for search input
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Set items per page
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [openRequest, setOpenRequest] = useState(false);
    const [previewdata,setPreviewData] = useState(null)

    const handleOpenRequest = (values) => {
        setPreviewData(values)
        setOpenRequest(!openRequest);

    }
    const [images, setImages] = useState(null);
    const [active, setActive] = useState(
        "https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
    );

    useEffect(() => {
        const unsubscribe = onSnapshot(
            collection(db, "Request"),
            (querySnapshot) => {
                const dataList = [];
                querySnapshot.forEach((doc) => {
                    dataList.push({ id: doc.id, ...doc.data() });
                });
                setData(dataList);
                setLoading(false);
            },
            (error) => {
                setError(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const ViewImages = (jeepImages) => {
        setOpen(!open);
        setImages(jeepImages);
    };

    const FilteredRequest = data.filter((driver) => {
        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase();
            return (
                driver.firstName?.toLowerCase().includes(lowerCaseSearchText) ||
                driver.address?.toLowerCase().includes(lowerCaseSearchText) ||
                driver.lastName?.toLowerCase().includes(lowerCaseSearchText)
            );
        }
        return true;
    });

    const totalPages = Math.ceil(FilteredRequest.length / itemsPerPage);

    const handlePageChange = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const RejectOrApproved = async (id, status) => {
        try {
            const docRef = await getUserDocRefById(id, "Request");
            await updateDoc(docRef, {
                status: status,
            });
            setOpenRequest(!openRequest);
            setPreviewData(null)
            
        } catch (err) {
            console.error("Error updating request: ", err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error fetching data: {error.message}</div>;
    }

    // Pagination logic
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = FilteredRequest.slice(startIndex, endIndex);

    return (
        <div className="w-full p-6">
            <Card className="h-auto p-10 w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-4 flex flex-col justify-between gap-8 md:flex-row md:items-center">
                        <div className="p-2">
                            <div className="flex  place-items-center gap-2 ">
                                <IconButton variant="gradient" color={"indigo"} className={`bg-['#FFFFFF'] p-[30px]  `} >
                                    <img alt="" src={form} className="" />

                                </IconButton>
                                <Typography color="gray" className=" PlusJakartaSans-Bold" variant="h4">Manage Request</Typography>
                            </div>
                        </div>
                        <div className="flex w-full shrink-0 pt-10 gap-2 md:w-max place-items-end justify-end">
                            <div className="md:w-72 place-items-end">
                                <Input
                                    className="w-[15rem]"
                                    icon={<MagnifyingGlassIcon />}
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                    color="blue"
                                    label="Search"
                                    placeholder="Search...."
                                />
                            
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="overflow-scroll px-0">
                    <table className="w-full min-w-max table-auto text-left">
                        <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-y border-blue-gray-100/50 bg-blue-100/50 p-4"
                                >
                                    <Typography variant="small" className="text-[11px] font-bold whitespace-nowrap uppercase text-blue-gray-400">
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((Applicants, index) => {
                            const isLast = index === paginatedData.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";
                            return (
                                <tr key={Applicants.id}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Avatar
                                                src={Applicants.profilePictureUrl}
                                                alt={Applicants.firstName}
                                                size="md"
                                                variant={"rounded"}
                                                className="border border-blue-gray-50 bg-blue-gray-50/50 object-contain p-1"
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {Applicants?.firstName + " " + Applicants?.lastName}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {Applicants.address}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {Applicants?.forHire ? "Available for hire" : "Not available for hire"}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                       <div className="flex ">

                                           <Chip
                                               size="sm"
                                               variant="ghost"
                                               value={Applicants.status}
                                               color={
                                                   Applicants.status === "approved"
                                                       ? "green"
                                                       : Applicants.status === "pending"
                                                           ? "amber"
                                                           : "red"
                                               }
                                           />
                                       </div>
                                    </td>
                                    {/*<td className={classes}>*/}
                                    {/*    <Typography*/}
                                    {/*        variant="small"*/}
                                    {/*        color="blue-gray"*/}
                                    {/*        className="font-bold capitalize"*/}
                                    {/*    >*/}
                                    {/*        {Applicants.phoneNumber}*/}
                                    {/*    </Typography>*/}
                                    {/*</td>*/}
                                    <td className={classes}>
                                        <div
                                            className="flex items-center -space-x-23"
                                            onClick={() => {
                                                ViewImages(Applicants.jeepImages);
                                            }}
                                        >
                                            {Applicants.jeepImages.slice(0, 3).map((url, idx) => (
                                                <Avatar
                                                    key={idx}
                                                    variant="rounded"
                                                    src={url}
                                                    className="border-2 border-white hover:z-10"
                                                />
                                            ))}
                                            {Applicants.jeepImages.length > 2&&
                                            <IconButton color="white" className="py-1 px-1 shadow-xl">
                                                <Typography className="font-bold text-primary">
                                                    {Applicants.jeepImages.length > 2 ? Applicants.jeepImages.length : null }
                                                </Typography>
                                            </IconButton>}
                                        </div>
                                    </td>
                                    <td className={classes}>

                                        <Tooltip
                                            className="bg-[#3083FF]"
                                            content="View Request"
                                            animate={{
                                                mount: { scale: 1, y: 0 },
                                                unmount: { scale: 0, y: 25 },
                                            }}
                                        >
                                            <IconButton onClick={() => { handleOpenRequest(Applicants) }}  className="bg-white  shadow-[20px]" >
                                                <FolderOpenIcon className="p-1 w-10 h-10 text-[#3083FF]" />
                                            </IconButton>
                                        </Tooltip>

                                      
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </CardBody>

                <div className="flex  px-10 place-items-center justify-end gap-2">
                    <IconButton
                        size="sm"
                        variant="outlined"
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />
                    </IconButton>
                    <Typography color="gray" className="font-normal">
                        Page <strong className="text-gray-900">    {currentPage} of {totalPages}</strong> of{" "}
                        <strong className="text-gray-900">{totalPages}</strong>
                    </Typography>
                    <IconButton
                        size="sm"
                        variant="outlined"
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        <ArrowRightIcon strokeWidth={2}  className="h-4 w-4" />
                    </IconButton>
                </div>
            </Card>
            <Dialog size="xl" className=" h-auto  bg-transparent shadow-none w-auto flex p-2 flex-col relative place-items-center"  open={openRequest}>

                <DialogBody className="h-full bg-white  rounded-2xl">
                    <button  onClick={()=>setOpenRequest(false)} className={"absolute -right-10 -top-10"}>
                        <XMarkIcon className="h-6 w-6 stroke-2 text-white"/>
                    </button>

                          <div className="bg-white gap-10 py-5  px-10 rounded-2xl flex">

                              <Avatar
                                  src={previewdata?.profilePictureUrl}
                                  alt="Tina Andrew"
                                  withBorder={true}
                                  color={"blue"}
                                  className={"w-[10rem] border-[8px] h-[10rem]"}
                              />
                              <div className="grid grid-cols-2  w-[450px] pt-5 gap-2  ">
                             <div className="h-full pr-4">
                             <Typography className="leading-2 PlusJakartaSans-Regular" variant={"paragraph"}>name</Typography>
                             <Typography className=" PlusJakartaSans-Regular" variant={"h6"}>{previewdata?.firstName +" "+ previewdata?.lastName}</Typography>
                                 </div>
                             <div className="h-full pr-4">

                             <Typography className="leading-2 PlusJakartaSans-Regular" variant={"paragraph"}>address</Typography>
                             <Typography className=" leading-4 PlusJakartaSans-Regular" variant={"h6"}>{previewdata?.address}</Typography>
                             </div>
                             <div className="h-full pr-4">
                                 <Typography className="leading-2 PlusJakartaSans-Regular" variant={"paragraph"}>for Hire</Typography>
                                 <Typography className=" PlusJakartaSans-Regular" variant={"h6"}>   {previewdata?.forHire ? "Available for hire" : "Not available for hire"}</Typography>

                             </div>
                             <div className="h-full pr-4">
                                 <Typography className="leading-2 PlusJakartaSans-Regular" variant={"paragraph"}>Phone Number</Typography>
                                 <Typography className=" PlusJakartaSans-Regular" variant={"h6"}>{previewdata?.phoneNumber}</Typography>

                              </div>
                             
                         </div>






                          </div>
                    <div className={`grid place-items-center px-10 gap-3 pt-10 grid-cols-${previewdata?.jeepImages?.length}`}>
                        {previewdata?.jeepImages.map((img, key) => (
                            <img
                                key={key}
                                src={img}
                                className="h-[200px] bg-black  rounded-2xl w-auto   object-contain"
                                alt="imgs"
                            />
                        ))}
                    </div>
                    <div className="w-full  px-10 py-5 flex place-items-center  flex-col justify-end">
                        <div className="flex gap-2 w-full">
                            {previewdata?.status !== "pending" ? (
                                <div className={`p-5 rounded-2xl  w-full flex flex-col gap-3   ${previewdata?.status === "approved" ? "border-green-400 bg-green-100/30" : " bg-red-100/40 border-red-400"} hover:cursor-not-allowed  border-[1px] text-center`}
                                    >
                                    <Typography
                                        className={`
                                            "mb-1 text-md PlusJakartaSans-Mediumpy-3 ${previewdata?.status === "approved" ? "text-green-400" : "text-red-400"} hover:cursor-not-allowed  border-[1px] text-center`}>
                                        
                                        This request is being {previewdata?.status}.
                                                 </Typography>
                                    <Chip
                                        size="sm"
                                        className={`py-3 ${previewdata?.status === "approved" ? "border-green-400" : "border-red-400"} hover:cursor-not-allowed  border-[1px] text-center`}
                                        variant="ghost"
                                        value={
                                            previewdata?.status === "approved"
                                                ? "Approved"
                                                : "Rejected"
                                        }
                                        color={
                                            previewdata?.status === "approved"
                                                ? "green"
                                                : "red"
                                        }
                                    />
                                    </div>
                                            ) : (
                                    <div className="flex place-items-center justify-end flex-col">

                                        <Typography className="mb-4 text-sm PlusJakartaSans-Medium text-orange-700 text-end">
                                                          Please review the details below and choose whether to accept or reject the request.
                                                        </Typography>
                                                 
                                                 <div className="flex gap-3">

                                            <Button
                                                color="green"
                                                className="py-2 px-2"
                                                onClick={() =>
                                                    RejectOrApproved(previewdata?.id, "approved")
                                                }
                                            >
                                                Accept
                                            </Button>
                                            <Button
                                                color="red"
                                                className="py-2 px-2"
                                                onClick={() =>
                                                    RejectOrApproved(previewdata?.id, "cancelled")
                                                }
                                            >
                                                Reject
                                            </Button>
                                                 </div>
                                                </div>
                                            )}
                                        </div>
                    </div>

                </DialogBody>

            </Dialog>

        </div>
    );
}

