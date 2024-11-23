import {
    Card,
    CardBody,
    Typography,
    Avatar,
    Chip,
    Menu,
    MenuHandler,
    MenuList,
    MenuItem,
    Button,
    Input, IconButton, DialogHeader, DialogBody, DialogFooter, Dialog, Spinner,
} from "@material-tailwind/react";
import {
    EyeIcon,
    PencilIcon,
    TrashIcon,
    MagnifyingGlassIcon, ArrowRightIcon, ArrowLeftIcon, AdjustmentsHorizontalIcon,

} from "@heroicons/react/24/outline";
import {FiInbox} from 'react-icons/fi';
import React, {useState} from "react";
import useFetchDriversOnce from "../customHooks/FetchDrivers.jsx";
import DynamicForm from "./DynamicForm.jsx";
import {AutoSizer, List} from "react-virtualized";
import {CheckCircleIcon, ExclamationTriangleIcon} from "@heroicons/react/24/solid";
import {Tooltip} from "@material-tailwind/react"
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";
import {getUserDocRefById} from "../functions/functions.js";
import {deleteDoc} from "firebase/firestore";
import wheel from "../assets/wheel.png"
import form from "../assets/form.png"
export default function DriversTable() {
    const [open, setOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [statusFilter, setStatusFilter] = useState(null);
    const [isHiredFilter, setIsHiredFilter] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const requiredText = 'Delete-driver';

    const isButtonDisabled = inputValue.trim().toLowerCase() !== requiredText.trim().toLowerCase();
    const [activeDeleteId, setActiveDeleteId] = useState(null)
const [loadingDelete,setLoadingDelete] = useState(false)
    const handleOpen = () => setOpen(!open);
    const {data, setrefresh, refresh} = useFetchDriversOnce("drivers");
    const [updateData, setUpdateData] = useState(null);
    const [formAction, setFormAction] = useState("");
    const [searchText, setSearchText] = useState("");
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    function handleUpdateData(driver, action) {
        setFormAction(action);
        handleOpen();
        setUpdateData(driver);
    }

    const handlerefresh = () => {
        setrefresh(!refresh)
    }
    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const handleOpenDeleteModal = (id) => {
        setOpenDeleteModal(!openDeleteModal)
        setActiveDeleteId(id)
    }

    const DeleteDriverPermanently = async () => {
        setLoadingDelete(true)
        if (!activeDeleteId) return false
        try {
            const docRef = await getUserDocRefById(activeDeleteId, "drivers");
            if (docRef) {
                await deleteDoc(docRef);
                console.log(`Driver with ID ${activeDeleteId} deleted successfully.`);
                setInputValue('')
                setrefresh(!refresh)
                setActiveDeleteId(null)
                setOpenDeleteModal(false)
                return true;
            } else {
                console.error(`No driver found with ID ${activeDeleteId}.`);
                return false; // Return failure status
            }
        } catch (error) {
            console.error("Error deleting driver:", error);
            return false;
        }finally {
            setLoadingDelete(false)
        }
    }


    const indexOfLastDriver = currentPage * itemsPerPage;
    const indexOfFirstDriver = indexOfLastDriver - itemsPerPage;

    const currentDrivers = data.filter(driver => {

        if (statusFilter && driver.status !== statusFilter) return false;
        if (isHiredFilter !== null && driver.forHire !== isHiredFilter) return false;

        if (searchText) {
            const lowerCaseSearchText = searchText.toLowerCase();
            return (
                driver.name.toLowerCase().includes(lowerCaseSearchText) ||
                driver.address.toLowerCase().includes(lowerCaseSearchText)
            );
        }

        return true;
    });
    const toggleStatusFilter = (status) => {
        setStatusFilter(status);
        setIsHiredFilter(null)
    };

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const handlePageChange = (pageNum) => {
        if (pageNum >= 1 && pageNum <= totalPages) {
            setCurrentPage(pageNum);
        }
    };

    const rowRenderer = ({index, key, style}) => {
        const driver = currentDrivers[index];
        return (
            <tr key={key} style={style} className=" border-b-2 h-full  ">
                <td className="py-3 px-5 border-b border-blue-gray-50">
                    <div className="flex items-center gap-4">
                        <Avatar src={driver?.imageUrl} alt="John Doe" size="sm" variant="rounded"/>
                        <div>
                            <Typography variant="small" color="blue-gray" className="font-semibold">
                                {driver?.name}
                            </Typography>
                        </div>
                    </div>
                </td>
                <td className="py-3 px-5  border-blue-gray-50">
                    <Chip
                        variant="gradient"
                        color={driver?.status === "online" ? "green" : driver?.status === "waiting" ? "orange" : "red"}
                        value={driver?.status}
                        className={`py-0.5 px-2 text-[11px] font-medium w-fit    `}
                    />
                </td>
                <td className="py-3 px-5  border-blue-gray-50">
                    <Typography as="a" href="#"
                                className="text-xs font-semibold PlusJakartaSans-Medium text-blue-gray-600">
                        {driver?.forHire ? "Available for hire" : "Not available for hire"}
                    </Typography>
                </td>
                <td className="py-3 px-5 flex place-items-center justify-center  border-blue-gray-50">

                    <Avatar
                        key={index}
                        src={driver?.jeepImages[0]}
                        alt={driver?.name}
                        size="lg"
                        variant="circular"
                        className={`cursor-pointer border-2 border-white ${index === 0 ? "" : "-ml-2.5"}`}
                    />

                </td>
                <td className="py-3 px-5   ">

                    <div className="flex">

                        <Tooltip content="View" className="bg-green-400 PlusJakartaSans-Medium text-[11px]">
                            <div onClick={() => handleUpdateData(driver, "view")}
                                 className="flex p-1 hover:bg-green-100  rounded-lg place-items-center gap-2 flex-row text-[#3083FF]">
                                <EyeIcon className="w-5 h-5" color="#3083FF"/>

                            </div>
                        </Tooltip>
                        <Tooltip content="Update" className="bg-blue-400 PlusJakartaSans-Medium text-[11px]">
                            <div onClick={() => handleUpdateData(driver, "update")}
                                 className="flex p-1  hover:bg-blue-100  rounded-lg place-items-center gap-2 flex-row text-[#3083FF]">
                                <PencilIcon className="w-5 h-5" color="#3083FF"/>

                            </div>
                        </Tooltip>
                        <Tooltip content="Delete" className="bg-red-400 PlusJakartaSans-Medium text-[11px]">
                            <div onClick={() => {
                                handleOpenDeleteModal(driver?.id)
                            }}
                                 className="flex  hover:bg-red-100  rounded-lg place-items-center gap-2 flex-row p-1 text-red-500 hover:text-red-500">
                                <TrashIcon className="w-5 h-5" color="red"/>
                            </div>
                        </Tooltip>

                    </div>

                </td>
            </tr>
        );
    };

    // Filter button click handler


    return (
        <div className="mt-5 mb-8 flex w-full flex-col gap-12">
            <div className="flex place-items-end justify-end">
                <div className="flex gap-5 flex-row justify-between w-full">
                 

                  <div className="flex  place-items-center gap-2 ml-3">
                        <IconButton variant="gradient" color={"orange"} className={`bg-['#FFFFFF'] p-[30px]  `} >
                            <img alt="" src={wheel} className="" />

                        </IconButton>
                        <Typography color="gray" className=" PlusJakartaSans-Bold" variant="h4">Drivers</Typography>
                    </div>
                    <div className="flex  gap-5 place-items-center">
                        <div className="flex gap-3">

                            <div className=" flex place-items-center  ">

                                {isHiredFilter || statusFilter ?
                                    <div
                                        className=" flex place-items-center shadow-md bg-white rounded-full  pl-3 px-2 py-1 gap-1 ">
                                        <Typography
                                            color={statusFilter === "waiting" ? "orange" : statusFilter === "online" ? "green" : statusFilter === "offline" ? "red" : "green"}
                                            className=" PlusJakartaSans-Medium text-[12px] whitespace-nowrap">{statusFilter || isHiredFilter === true && "Available for hire"}</Typography>
                                        <XMarkIcon onClick={() => {
                                            setStatusFilter(null)
                                            setIsHiredFilter(null)
                                        }} strokeWidth={3}
                                            className="h-5 w-5 text-gray-600   strokeWidth-20  rounded-full p-1" />

                                    </div> : null}
                            </div>

                            <Menu>
                                <MenuHandler>


                                    <AdjustmentsHorizontalIcon className={"w-7 "}
                                        color={"grey"}></AdjustmentsHorizontalIcon>
                                </MenuHandler>
                                <MenuList>"
                                    <MenuItem onClick={() => toggleStatusFilter("online")}
                                        className={"flex flex-row place-items-center gap-2"}>
                                        <div className="w-3 h-3 rounded-full full bg-green-400" />
                                        online</MenuItem>
                                    <MenuItem onClick={() => toggleStatusFilter("waiting")}
                                        className={"flex flex-row place-items-center gap-2"}>
                                        <div className="w-3 h-3 rounded-full full bg-orange-400" />
                                        waiting</MenuItem>

                                    <MenuItem onClick={() => toggleStatusFilter("offline")}
                                        className={"flex flex-row place-items-center gap-2"}>
                                        <div className="w-3 h-3 rounded-full full bg-red-400" />
                                        offline</MenuItem>
                                    <MenuItem onClick={() => {
                                        setStatusFilter(null)
                                        setIsHiredFilter(true)

                                    }} className={"flex flex-row place-items-center gap-2"}> <CheckCircleIcon color=""
                                        className="w-5 h-5  " /> Available
                                        for hire</MenuItem>

                                </MenuList>
                            </Menu>
                        </div>
                        <Input className="w-[15rem]" icon={<MagnifyingGlassIcon />} value={searchText}
                            onChange={(e) => setSearchText(e.target.value)} color="blue" label="Search"
                            placeholder="Search...." />
                    </div>
                </div>
            </div>

            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full  table-auto">
                    <thead className="rounded-lg ">
                    <tr>
                        {["Driver name", "status", "for hire", "Jeep images", "action"].map((el) => (
                            <th key={el}
                                className="border-b   border-blue-gray-50 py-3 px-5 text-left   bg-blue-100/50  ">
                                <Typography variant="small"
                                            className="text-[11px] font-bold whitespace-nowrap uppercase text-blue-gray-400">
                                    {el}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody className="">
                    {currentDrivers.length > 0 ? currentDrivers.map((driver, index) => rowRenderer({
                            index,
                            key: index,
                            style: {}
                        }))
                        : null
                    }

                    </tbody>

                </table>
                {!currentDrivers.length > 0 && <div className="w-full flex  ">

                    <div className="flex w-full flex-col items-center justify-center  p-4">
                        <div className=" w-full ">
                            <div className="flex flex-col items-center">
                                <FiInbox color={"#3083ff"} className="text-gray-400 text-2xl"/>
                                <h2 className=" text-md font-semibold text-gray-700">
                                    No Matching Records for Driver
                                </h2>
                                <p className="PlusJakartaSans-Regular text-sm text-center text-gray-500">
                                    It looks like we couldn’t find any Records here. Start by Searching different
                                    Driver.
                                </p>

                            </div>
                        </div>
                    </div>

                </div>}
            </CardBody>

            <div className="flex  px-10 place-items-center justify-end gap-2">
                <IconButton
                    size="sm"
                    variant="outlined"
                    onClick={() => handlePageChange(currentPage - 1)}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4"/>
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
                    <ArrowRightIcon strokeWidth={2} className="h-4 w-4"/>
                </IconButton>
            </div>
            <Dialog open={openDeleteModal} handler={handleOpenDeleteModal}>
                <div className="p-6 space-y-4">
                    <div className="flex place-items-center">
                        <ExclamationTriangleIcon className="w-[50px] text-red-400"/>
                        <h3 className="text-lg PlusJakartaSans-Bold text-red-400">Confirm Driver Deletion</h3>

                    </div>
                    <p>
                        To confirm the deletion of this driver, please type
                        <strong className="PlusJakartaSans-Bold text-red-400"> {requiredText} </strong>
                        exactly as shown in the input field below. This action is irreversible and will permanently
                        remove all associated data with this driver.
                        Proceed only if you are absolutely certain.
                    </p>

                    <Input value={inputValue}
                           onChange={handleInputChange} label={requiredText} error/>

                    <div className="flex justify-end space-x-2">
                        <Button variant="outlined" color="gray" className="text-red-400 border-red-400" onClick={handleOpenDeleteModal}>
                            Cancel
                        </Button>
                        <Button
                            variant="gradient"
                            color="red"
                            className=""
                            onClick={DeleteDriverPermanently}
                            disabled={isButtonDisabled}
                        >
                            {loadingDelete ?    <Spinner color="orange" /> :       "Confirm"}

                        </Button>
                    </div>
                </div>
            </Dialog>

            <DynamicForm open={open} handleOpen={handleOpen} data={updateData} handlerefresh={handlerefresh}
                         action={formAction}/>
        </div>
    );
}

