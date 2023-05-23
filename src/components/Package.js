import React, { useEffect } from 'react';
import { useState } from 'react';
import uploadToCloudinary from '../helper/cloudinaryUpload';
import { api } from '../helper/Api';
import { ToastContainer, toast } from 'react-toast';
import { useNavigate } from 'react-router-dom';


function Package() {
    const [packages, setPackages] = useState({
        package_name: "",
        price: 0,
        description: "",
        image: "",
        serviceId: []
    });
    const [image, setImage] = useState("");
    const [servicesData, setServicesData] = useState(null);
    const [packageData, setPackageData] = useState(null);
    const [count, setCount] = useState(0);
    const naviagte = useNavigate();

    console.log("", packages)

    useEffect(() => {
        const fetchData = async () => {
            const data = await api.get('http://localhost:30001/servicesroutes/');
            setServicesData(data.data);
        }
        const fetchPackageData = async () => {
            const data = await api.get('http://localhost:30001/packageroutes/');
            setPackageData(data.data);
        }
        fetchData()
        fetchPackageData()
    }, [count])


    const handleData = (e) => {
        setPackages({ ...packages, [e.target.name]: e.target.value });
    }

    const uploadImage = async (e) => {
        if (e.target.files && e.target.files[0]) {
            const data = e.target.files[0];
            const objectURL = URL.createObjectURL(data);
            setImage(objectURL);
            const uploadFile = await uploadToCloudinary(data);
            console.log(uploadFile);
            setPackages({ ...packages, [e.target.name]: uploadFile.url });
        }
    }

    const addService = (service) => {
        if(packages.serviceId.includes(service._id)){
            toast("service id already exists")
        }else{
            setPackages({ ...packages, serviceId: [...packages.serviceId, service._id], price: packages.price + service.price })
        }
    }

    const removeService = (service) => {
        const newService = packages.serviceId.filter(element => element !== service._id);
        if(packages.price === 0 || !newService){
            return;
        }else{
            setPackages({...packages, price: packages.price - service.price, serviceId: newService  })
        }
    }


    const submitData = async (e) => {
        e.preventDefault();
        let response;
        try {
            const data = await api.post('http://localhost:30001/packageroutes/createpackage', packages);
            response = data.data;
            if (response.success === true) {
                setCount(count + 1)
                toast(response.message);
            }
        } catch (error) {
            console.log(error);
        }

    }

    const editPackage = async(e, id) => {
        e.preventDefault();
        naviagte(`/editpackage/${id}`)
    }


    const deletePackage = async(e, id) => {
        e.preventDefault();
        let response;
        try {
            const data = await api.delete(`http://localhost:30001/packageroutes/deletepackage/${id}`);
            response = data.data;
            if(response.success === true){
                setCount(count + 1)
                toast(response.message);
            }
        } catch (error) {
            console.log(error);
        }
    }



    return (
        <div className='ml-10 mt-10'>
            <ToastContainer autoClose={3000}/>
            <div className='flex justify-center'>
                {image && <img src={image} alt='newImage' />}
            </div>
            <form className="w-full">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                            Package Name
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='package_name' type="text" onChange={(e) => handleData(e)} />
                    </div>
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                            Image
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='image' type="file" onChange={(e) => uploadImage(e)} />
                    </div>
                </div>


                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full px-3">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                            Description
                        </label>
                        <textarea rows="10" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='description' onChange={(e) => handleData(e)}>
                        </textarea>
                    </div>
                    <div className="flex justify-between w-full px-3">
                        <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit" onClick={(e) => submitData(e)}>
                            Create Package
                        </button>
                    </div>

                </div>

            </form>
            {servicesData?.data?.map((service, i) => (
                <div className='flex flex-row' key={i}>
                    <div className='shadow-lg h-64 w-64 rounded-md p-5 my-10'>
                        <h1 className=''>{service.package_name}</h1>
                        <img src={service.image} alt='newImage' className='h-10' />
                        <div className='flex flex-row space-x-5'>
                            {
                                packages?.serviceId?.includes(service._id) ? 
                                <>
                                <button className='border text-white p-2 mt-10 rounded bg-blue-300' disabled onClick={(e) => addService(service)}>
                                Add Service
                            </button>
                                </> : 
                                <>
                                 <button className='border text-white p-2 mt-10 rounded bg-[#146C94]' onClick={(e) => addService(service)}>
                                    Add Service
                                </button>
                                </>
                            }
                            <button className='border text-white p-2 mt-10 rounded bg-red-500' onClick={(e) => removeService(service)}>
                                Remove Service
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            <div className='table'>
                <div className="container mx-auto px-4 sm:px-8">
                    <div className="py-8">
                        <div>
                            <h2 className="text-2xl font-semibold leading-tight">Services</h2>
                        </div>
                        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                            <div
                                className="inline-block min-w-full shadow-md rounded-lg overflow-hidden"
                            >
                                <table className="min-w-full leading-normal">
                                    <thead>
                                        <tr>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                Package Name
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                Price
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                Image
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                Description
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                            <th
                                                className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"
                                            ></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {packageData?.data?.map((packages, i) => (
                                            <tr key={i}>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex">
                                                        {packages.package_name}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">{packages.price}</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <img src={packages.image} alt='newImage' className='h-10' />
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    {packages.description}
                                                </td>
                                                <td
                                                    className="px-5 space-x-2 py-5 border-b border-gray-200 bg-white text-sm text-right"
                                                >
                                                    <button className='border text-white p-2 mt-[-10px] rounded bg-[#146C94]' onClick={(e) => editPackage(e, packages?._id)}>
                                                        Edit
                                                    </button>
                                                    <button className='border text-white p-2 mt-[-10px] rounded bg-red-500' onClick={(e) => deletePackage(e, packages?._id)}>
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Package
