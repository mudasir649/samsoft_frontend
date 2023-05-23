import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toast';
import { api } from '../helper/Api';
import uploadToCloudinary from '../helper/cloudinaryUpload';

function EditPackage() {

    const [dataPackage, setDataPackage] = useState('');
    const [image, setImage] = useState(null)

    const { id } = useParams()

    useEffect(() => {
        const fetchData = async () => {
            const data = await api.get(`http://localhost:30001/packageroutes/specificpackage/${id}`);
            setDataPackage(Object.assign({}, data?.data?.data));
        }
        fetchData();
    },[id]);

    const uploadImage = async(e) => {
        if(e.target.files && e.target.files[0]){
          const data = e.target.files[0];
          const objectURL = URL.createObjectURL(data);
          setImage(objectURL);
          const uploadFile = await uploadToCloudinary(data);
          console.log(uploadFile);
        //   setEditData({...editData, [e.target.name]: uploadFile.url});
        }
      }

    const handleData = (e) => {

    }

    const editPackage = async(e) => {

    }

  return (
    <div>
      <div className='mx-20 my-20'>
      <ToastContainer />
         <form className="w-full">
            <img src={dataPackage[0]?.image} className='flex justify-center' alt='newImage' />      
         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                     Package Name
                 </label>
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='package_name' type="text" placeholder={EditPackage[0]?.package_name} onChange={(e) => handleData(e)}/>
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
                 <textarea rows="10" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='description' placeholder={EditPackage[0]?.description} onChange={(e) => handleData(e)}> 
                 </textarea>
             </div>
             <div className="flex justify-between w-full px-3">
                 <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit" onClick={(e) => editPackage(e)}>
                     Edit Service
                 </button>
             </div>
         </div>
     </form>
    </div>
    </div>
  )
}

export default EditPackage
