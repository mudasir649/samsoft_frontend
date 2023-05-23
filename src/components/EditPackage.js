import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toast';
import { api } from '../helper/Api';
import uploadToCloudinary from '../helper/cloudinaryUpload';

function EditPackage() {

    const [packageData, setPackageData] = useState({
        package_name:"",
        price: 0,
        description:"",
        image:"",
        serviceId: []
    })
    const [dataPackage, setDataPackage] = useState('');
    const [servicesId, setServicesId] = useState('')
    const [serviceData, setServiceData] = useState('');
    const [image, setImage] = useState(null);
    const [count, setCount] = useState(0);

    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const data = await api.get(`http://localhost:30001/packageroutes/specificpackage/${id}`);
            let Sid = Object.assign({}, data?.data?.data[0])
            setDataPackage(Object.assign({}, data?.data?.data));
            setServicesId(Sid?.serviceId)
        }
        const fetchServicesData = async () => {
            const data = await api.get(`http://localhost:30001/servicesroutes`);
            setServiceData(data?.data);
        }
        fetchData();
        fetchServicesData();
    },[id]);

    const uploadImage = async(e) => {
        if(e.target.files && e.target.files[0]){
          const data = e.target.files[0];
          const objectURL = URL.createObjectURL(data);
          setImage(objectURL);
          const uploadFile = await uploadToCloudinary(data);
          console.log(uploadFile);
          setPackageData({...packageData, [e.target.name]: uploadFile.url});
        }
      }

    const handleData = (e) => {
        setPackageData({...packageData, [e.target.name]: e.target.value});
    }

    const addService = (service) => {
        if(packageData.serviceId.includes(service._id)){
            toast("service id already exists")
        }else{
            setPackageData({ ...packageData, serviceId: [...packageData.serviceId, service._id], price: packageData.price + service.price })
        }
    }

    const removeService = (service) => {
        const newArr = servicesId?.filter(el => {
            return el !== service._id
        });
        console.log(newArr);
        setServicesId(newArr);
        const packageId = packageData?.serviceId?.filter(el => {
            return el !== service._id;
        });
        if(packageData?.price === 0 || !packageId){
            return
        }else{
            setPackageData({...packageData, price: packageData.price - service.price, serviceId: packageId})
        }
    }

    const checkService = (service) => {
        if(servicesId?.includes(service._id) || packageData?.serviceId.includes(service._id)){
            return true;
        }else{
            return false;
        }
    }

    const editPackage = async(e) => {
        e.preventDefault()
        let response;
        console.log("", packageData);
        try {
            const data = await api.post(`http://localhost:30001/packageroutes/updatepackage/${id}`, packageData);
                response = data.data;
                if (response.success === true) {
                    setCount(count + 1)
                    toast(response.message);
                }
        } catch (error) {
           console.log(error); 
        }
    }


  return (
    <div>
      <div className='mx-20 my-20'>
      <ToastContainer />
         <form className="w-full">
         {image !== null ? <>
            <img src={image} className='flex justify-center' alt='newImage' />
           </> : 
           <>
            <img src={dataPackage[0]?.image} className='flex justify-center' alt='newImage' />
           </>}  
         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                     Package Name
                 </label>
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='package_name' type="text" placeholder={dataPackage[0]?.package_name} onChange={(e) => handleData(e)}/>
             </div>
             <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                     Image
                 </label>
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='image' type="file" onChange={(e) => uploadImage(e)}/>
             </div>
         </div>
         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                     Price
                 </label>
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='price' type="text" placeholder={dataPackage[0]?.price} onChange={(e) => handleData(e)}/>
             </div>
         </div>

         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full px-3">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                     Description
                 </label>
                 <textarea rows="10" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='description' placeholder={dataPackage[0]?.description} onChange={(e) => handleData(e)}> 
                 </textarea>
             </div>
             <div className="flex justify-between w-full px-3">
                 <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit" onClick={(e) => editPackage(e)}>
                     Edit Package
                 </button>
             </div>
         </div>
     </form>
     {serviceData?.data?.map((service, i) => (
                <div className='flex flex-row' key={i}>
                    <div className='shadow-lg h-64 w-64 rounded-md p-5 my-10'>
                        <h1 className=''>{service.package_name}</h1>
                        <img src={service.image} alt='newImage' className='h-10' />
                        <div className='flex flex-row space-x-5'>
                            <button className={`border text-white p-2 mt-10 rounded ${servicesId?.includes(service._id) || packageData?.serviceId.includes(service._id) ? 'bg-blue-300': 'bg-[#146C94]'}`} 
                                disabled={checkService(service)} 
                                onClick={(e) => addService(service)}>
                                Add Service
                            </button>
                            <button className='border text-white p-2 mt-10 rounded bg-red-500' onClick={(e) => removeService(service)}>
                                Remove Service
                            </button>
                        </div>
                    </div>
                </div>
            ))}
    </div>
    </div>
  )
}

export default EditPackage
