import React, {useRef, useState} from 'react';
import {
    Avatar,
    Button,
    Dialog,
    DialogBody, DialogFooter,
    DialogHeader,
    IconButton,
    Input,
    Radio, Spinner,
    Typography
} from "@material-tailwind/react";
import {XMarkIcon} from "@heroicons/react/24/outline/index.js";
import camera from "../assets/camera-retro.png";
import {ErrorMessage, Field, Form, Formik} from 'formik';
import * as Yup from 'yup';
import addCameraicon from "../assets/add-image.png"
import {getDownloadURL, getStorage, ref, uploadBytes} from 'firebase/storage';
import {getUserDocRefById} from "../functions/functions.js";
import {updateDoc} from "firebase/firestore";
import useFetchDriversOnce from "../customHooks/FetchDrivers.jsx";

const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    address: Yup.string().required('Address is required'),
    phoneNumber: Yup.string().required('Phone Number is required').matches(/^[0-9]+$/, 'Phone Number must be a valid number'),
    jeepName: Yup.string().required('Jeep Name is required'),
    image: Yup.mixed().required('Profile Picture is required'),
    jeepImages: Yup.mixed().required('At least one image is required'),
    forhire: Yup.boolean().required('Hire Status is required')
});

function DynamicForm({open, handleOpen, data = null, action,handlerefresh}) {
    console.log(action)

    const fileInputRef = useRef(null);
    const MultipleImageRef = useRef(null);
    const [openimage, setopenimage] = useState(false)
   const [activejeepimage,setActivejeepimage] = useState(null)
    const [Activeid,setActiveid] = useState(null)
    const [loading,setLoading] = useState(false)
    const handleOpenimage = (image,id) => {

  if (Activeid === id && action === "view"){
      setActivejeepimage(image)
      setopenimage(!openimage)
  }

    }
    const [previewImage, setImagePreview] = useState(null)
    const [previewMultipleImage, setMultipleImagePreview] = useState(null)

    const handleDivClick = () => {
        // Trigger the click event on the file input
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    const handleMultipleImage = () => {
        // Trigger the click event on the file input
        if (MultipleImageRef.current) {
            MultipleImageRef.current.click();
        }
    };
    const handleMultipleFileChange = (event, setFieldValue) => {
        const files = event.target.files; // Get the selected files
        const imageUrls = [];

        for (let i = 0; i < files.length; i++) {
            const imageUrl = URL.createObjectURL(files[i]);
            imageUrls.push(imageUrl); // Add each image URL to the array
        }
        setMultipleImagePreview(imageUrls)
        // Assuming you want to store the file URLs (not the file objects themselves)
        setFieldValue("jeepImages", files);
    };

    const handleFileChange = (event, setFieldValue) => {
        const file = event.target.files[0];
        if (file) {

            const imageUrl = URL.createObjectURL(file);
            setImagePreview(imageUrl);
            setFieldValue("image", file);
        }
    };
    const SetMultipleImage = ({values, setFieldValue}) => {
        return (

            <div className="flex flex-row gap-3">
                <input multiple accept="image/*" onChange={(e) => handleMultipleFileChange(e, setFieldValue)}
                       ref={MultipleImageRef} type={"file"} className={"hidden"}/>

                {action !== "view"
                    && <button type={"button"} onClick={handleMultipleImage}
                               className=" shadow-[0_3px_4px_-2px_rgba(0,0,0,0.6)] bg-white  rounded-2xl ">

                        <img src={addCameraicon} alt="" className="w-[5rem] p-2 rounded-md object-cover h-[5rem] "/>
                    </button>

                }
                {previewMultipleImage ?
                    previewMultipleImage.map((url, index) => (
                        <img onClick={()=>{handleOpenimage(url,values.id)
                            setActiveid(id)
                        }}  key={index} src={url} alt="" className="w-[5rem] rounded-2xl object-cover h-[5rem] "/>
                    ))
                    : values?.jeepImages.map((url, index) => (
                        <img onClick={()=>{handleOpenimage(url,values.id)
                            setActiveid(values?.id)
                        }}  src={url} alt="" className="w-[5rem] rounded-2xl object-cover h-[5rem] "/>
                    ))

                }

            </div>
        )
    }

    async function GetImageDownloadURL(result, isfileUrl) {

        console.log('Processing file(s)...');
        const storage = getStorage();

        // Check if result is a FileList and convert it to an array
        const files = result instanceof FileList ? Array.from(result) : Array.isArray(result) ? result : [result];

        if (isfileUrl) {
            // Upload and get download URLs for each file
            const uploadPromises = files.map(async (file) => {
                if (file instanceof File) {
                    const imageRef = ref(storage, `images/${file.name}`);
                    await uploadBytes(imageRef, file);
                    const downloadURL = await getDownloadURL(imageRef);
                    console.log(`Uploaded ${file.name}: ${downloadURL}`);
                    return downloadURL;
                } else {
                    console.warn('Invalid file encountered, skipping:', file);
                    return null;
                }
            });

            // Wait for all uploads to complete and gather the download URLs
            const downloadURLs = await Promise.all(uploadPromises);
            console.log('All images uploaded:', downloadURLs.filter(Boolean)); // Filter out nulls
            return downloadURLs.filter(Boolean); // Return only valid URLs
        } else {
            console.warn('No preview options provided. Returning the result as is.');
            return result;
        }
    }


    const SetAvatar = ({values, setFieldValue}) => {
        return (
            <div className=" relative ">
                <img src={previewImage ? previewImage : values?.image} alt="avatar"
                     className={"object-cover w-[10rem]  rounded-full border-[4px]"}/>
                <input accept="image/*" onChange={(e) => handleFileChange(e, setFieldValue)} ref={fileInputRef}
                       type={"file"} className={"hidden"}/>
                <div onClick={handleDivClick}
                     className={"bg-[#3083FF] w-10 border-4  absolute rounded-full  p-2 bottom-0 right-0"}>
                    <img alt={""} src={camera} className={""}/>
                </div>
            </div>
        )
    }
    const SubmitUpdate = async (values,resetForm) => {
        setLoading(true)
    const UpdateRef = await getUserDocRefById(values?.id, "drivers");
        const image = await GetImageDownloadURL(values?.image, previewImage)
        const MulitpleImage = await GetImageDownloadURL(values?.jeepImages, previewMultipleImage)
        const UpdateProfileData = {
            id: values?.id,
            address: values?.address,
            imageUrl: Array.isArray(image) ? image[0] : image,
            jeepImages: MulitpleImage,
            jeepName: values?.jeepName,
            name: values?.firstName + " " + values?.lastName,
            phoneNumber: values?.phoneNumber,
            forHire: values?.forhire,
        }

        await updateDoc(UpdateRef, UpdateProfileData);
        setLoading(false)
        handlerefresh()
        resetForm()
        handleOpen()

    }


    const name = data?.name.split(/\s+/);
    const setAction = action === "view"
    return (
        <>
            <Dialog size="sm" open={open} handler={handleOpen} className="p-4">
                <DialogHeader className="relative m-0 flex flex-row   w-full justify-between">
                    <Typography variant={"h4"} color={"gray"} className="PlusJakartaSans-Bold">
                        {action === "view" ? "    Driver Profile" : "Edit Driver Profile"}
                    </Typography>

                    <IconButton size="sm" variant="text" onClick={handleOpen}>
                        <XMarkIcon className="h-4 w-4 stroke-2"/>
                    </IconButton>


                </DialogHeader>
                <div className="space-y-4 pb-6">
                    <Formik
                        initialValues={{
                            id: data?.id,
                            firstName: data ? name.length >= 3 ? name[0] + " " + name[1] : name[0] : '',
                            lastName: name ? name[name.length-1] : '',
                            address: data?.address || '',
                            phoneNumber: data?.phoneNumber || '',
                            jeepName: data?.jeepName || '',
                            image: data?.imageUrl || null,
                            jeepImages: data?.jeepImages,
                            forhire: !!data?.forHire,

                        }}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={async (values,{resetForm}) => {
                            await SubmitUpdate(values,resetForm);

                        }}
                    >
                        {({errors, touched, handleSubmit,resetForm, setFieldValue, values}) => (
                            <Form className="flex flex-col gap-3">
                                <div className="flex">
                                    <div>
                                        <SetAvatar values={values} setFieldValue={setFieldValue}/>
                                    </div>

                                    <div className="flex flex-col gap-3 px-4 w-full">
                                        <div>
                                            <Field
                                                name="firstName"
                                                as={Input}
                                                disabled={setAction}
                                                error={errors.firstName && touched.firstName}
                                                color="blue"
                                                label="First Name"
                                                className={errors.firstName && touched.firstName ? 'border-red-500' : ''}
                                            />
                                            <ErrorMessage name="firstName" component="div"
                                                          className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                        </div>
                                        <div>
                                            <Field
                                                name="lastName"
                                                as={Input}
                                                disabled={setAction}
                                                color="blue"
                                                error={errors.lastName && touched.lastName}
                                                label="Last Name"
                                                className={errors.lastName && touched.lastName ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                            />
                                            <ErrorMessage name="lastName" component="div"
                                                          className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                        </div>
                                        <div>
                                            <Field
                                                name="address"
                                                as={Input}
                                                disabled={setAction}
                                                color="blue"
                                                error={errors.address && touched.address}
                                                label="Address"
                                                className={errors.address && touched.address ? 'border-red-500' : ''}
                                            />
                                            <ErrorMessage name="address" component="div"
                                                          className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-row gap-3 px-4 w-full">
                                    <div className="w-full">
                                        <Field
                                            name="phoneNumber"
                                            as={Input}
                                            disabled={setAction}
                                            color="blue"
                                            label="Phone Number"
                                            error={errors.phoneNumber && touched.phoneNumber}
                                            className={errors.phoneNumber && touched.phoneNumber ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                        />
                                        <ErrorMessage name="phoneNumber" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                    </div>

                                    <div className="w-full">
                                        <Field
                                            name="jeepName"
                                            as={Input}
                                            disabled={setAction}
                                            error={errors.jeepName && touched.jeepName}
                                            color="blue"
                                            label="Jeep Name"
                                            className={errors.jeepName && touched.jeepName ? 'border-red-500 PlusJakartaSans-Medium' : ''}
                                        />
                                        <ErrorMessage name="jeepName" component="div"
                                                      className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>
                                    </div>
                                </div>
                                <div className="flex flex-col">


                                    <div>

                                        <Typography variant="paragraph" className="pl-3 PlusJakartaSans-Medium">
                                            is Jeep for hire?
                                        </Typography>
                                        <Field
                                            type="radio"
                                            name="forhire"
                                            value="yes" // String value for this radio option
                                            onChange={() => setFieldValue('forhire', true)} // Store true for "Yes"
                                            as={Radio}
                                            checked={values.forhire === true} // Checked if value is true
                                            disabled={setAction}
                                            color="blue"
                                            label="Yes"
                                        />
                                        <Field
                                            type="radio"
                                            name="forhire"
                                            value="no" // String value for this radio option
                                            onChange={() => setFieldValue('forhire', false)} // Store false for "No"
                                            as={Radio}
                                            checked={values.forhire === false} // Checked if value is false
                                            disabled={setAction}
                                            color="blue"
                                            label="No"
                                        />


                                    </div>
                                    <ErrorMessage name="forhire" component="div"
                                                  className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                </div>
                                <SetMultipleImage values={values} setFieldValue={setFieldValue}/>

                                <ErrorMessage name="jeepImages" component="div"
                                              className="text-red-500 text-[11px] PlusJakartaSans-Regular"/>

                                <div className={"flex flex-row gap-2 pt-4"}>
                                    <button color='blue' onClick={handleOpen}
                                            className="w-full shadow-md border-2 PlusJakartaSans-Regular rounded-full text-[#3083FF] p-2 border-[#3083FF] ">
                                        Cancel
                                    </button>
                                    {
                                        action === "update"&& <button type="submit" color='blue' onClick={handleSubmit}
                                                                      className="w-full shadow-md border-2 bg-[#3083FF] PlusJakartaSans-Regular rounded-full text-white  flex place-items-center justify-center p-2 border-[#3083FF] ">
                                        {loading ?    <Spinner  className="w-5 h-5"/>:
                                                "Update"}
                                        </button>
                                    }
                                </div>

                            </Form>
                        )}
                    </Formik>
                </div>
                <Dialog size="xl" className="h-[80vh] bg-transparent shadow-none w-auto flex p-2 flex-col relative w-full place-items-center"  open={openimage} handler={handleOpenimage}>

                    <DialogBody className="h-full">
                        <button  onClick={()=>setopenimage(false)} className={"absolute -right-5 -top-5"}>
                            <XMarkIcon className="h-6 w-6 stroke-2 text-white"/>
                        </button>
                        <img
                            alt="nature"
                            className="h-full w-full rounded-lg object-cover object-center"
                            src={activejeepimage}
                        />
                    </DialogBody>

                </Dialog>
            </Dialog>


        </>
    );
}

export default DynamicForm;
