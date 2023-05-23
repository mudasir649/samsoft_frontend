import React, { useEffect, useState } from 'react'
import uploadToCloudinary from '../helper/cloudinaryUpload';
import { api } from '../helper/Api';
import { ToastContainer, toast } from 'react-toast';
import { useNavigate } from 'react-router-dom';

function Services() {
    const [image, setImage] = useState("");
    const [count, setCount] = useState(0)
    const [servicesData, setServicesData] = useState(null)
    const [services, setServices] = useState({
        package_name: "",
        price: "",
        description: "",
        image: ""
    });
    const handleData = (e) => {
        setServices({...services, [e.target.name]: e.target.value});
    }

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const data = await api.get('http://localhost:30001/servicesroutes/');
            setServicesData(data.data);
        }
        fetchData()
    }, [count])

    const uploadImage = async(e) => {
        if(e.target.files && e.target.files[0]){
          const data = e.target.files[0];
          const objectURL = URL.createObjectURL(data);
          setImage(objectURL);
          const uploadFile = await uploadToCloudinary(data);
          console.log(uploadFile);
          setServices({...services, [e.target.name]: uploadFile.url});
        }
      }

    const submitData = async(e) => {
        e.preventDefault();
        let response;
        try {
            const data = await api.post('http://localhost:30001/servicesroutes/createservice', services);
            response = data.data;
            if(response.success === true){
                toast(response.message);
                setCount(count + 1);
            }
        } catch (error) {
            console.log(error.response);
        }
    }

    const editService = (e, id) => {
        e.preventDefault();
        navigate(`/editservice/${id}`)
    }

    const deleteService = async(e, id) => {
        e.preventDefault();
        let response;
        try {
            const deleteService = await api.delete(`http://localhost:30001/servicesroutes/deleteservice/${id}`);
            response = deleteService.data;
            if(response.success === true){
                toast(response.message);
                setCount(count + 1);

            }
        } catch (error) {
            toast("unable to delete.")
        }
    }


    return (
        <div className='ml-10 mt-10'>
            <div className='flex justify-center'>
                {image && <img src={image} alt='newImage' />}
            </div>
            <ToastContainer/>
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
                    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                            Price
                        </label>
                        <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='price' type="text" onChange={(e) => handleData(e)} />
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
                            Create Service
                        </button>
                    </div>
                </div>
            </form>
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
                                        {servicesData?.data?.map((services, i) => (
                                            <tr key={i}>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <div className="flex">
                                                    {services.package_name}
                                                </div>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <p className="text-gray-900 whitespace-no-wrap">{services.price}</p>
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                <img src={services.image} alt='newImage' className='h-10' />
                                            </td>
                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                {services.description}
                                            </td>
                                            <td
                                                className="px-5 space-x-2 py-5 border-b border-gray-200 bg-white text-sm text-right"
                                            >
                                            <button className='border text-white p-2 mt-[-10px] rounded bg-[#146C94]' onClick={(e) => editService (e, services?._id)}>
                                                Edit
                                            </button>
                                            <button className='border text-white p-2 mt-[-10px] rounded bg-red-500' onClick={(e) => deleteService(e, services?._id)}>
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
        </div >
    )
}

export default Services
