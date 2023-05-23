import React, { useEffect, useState } from 'react'
import { api } from '../helper/Api';
import { useParams } from 'react-router-dom';
import uploadToCloudinary from '../helper/cloudinaryUpload';
import { ToastContainer, toast } from 'react-toast';


function EditServices() {

    const { id } = useParams();
    const [editService, setEditServices] = useState(null);
    const [editData, setEditData] = useState({
      package_name: "",
      price: 0,
      image:"",
      description:""
    });
    const [image, setImage] = useState('')

    const handleData = (e) => {
      setEditData({...editData, [e.target.name]: e.target.value});
    }

    useEffect(() => {
        const fetchData = async() => {
            const data = await api.get(`http://localhost:30001/servicesroutes/specificservice/${id}`);
            setEditServices(Object.assign({}, data?.data?.data))
        }
        fetchData()
    }, [id])


    const uploadImage = async(e) => {
      if(e.target.files && e.target.files[0]){
        const data = e.target.files[0];
        const objectURL = URL.createObjectURL(data);
        setImage(objectURL);
        const uploadFile = await uploadToCloudinary(data);
        console.log(uploadFile);
        setEditData({...editData, [e.target.name]: uploadFile.url});
      }
    }

    const edit_Service = async(e) => {
      e.preventDefault();
      let response;
      try {
        const edit = await api.post(`http://localhost:30001/servicesroutes/updateservice/${id}`, editData);
        response = edit.data;
        if(response.success === true){
          toast(response.message)
        }
      } catch (error) {
        console.log(error);
      }
    }

  return (
    <div className='mx-20 my-20'>
      <ToastContainer />
      {editService !== null && 
         <form className="w-full">
           {image !== null ? <>
            <img src={image} className='flex justify-center' alt='newImage' />
           </> : 
           <>
            <img src={editService[0]?.image} className='flex justify-center' alt='newImage' />
           </>}       
         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-first-name">
                     Package Name
                 </label>
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='package_name' type="text" placeholder={editService[0]?.package_name} onChange={(e) => handleData(e)}/>
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
                 <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-red-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white" id="grid-first-name" name='price' type="text" placeholder={editService[0]?.price} onChange={(e) => handleData(e)}/>
             </div>
         </div>

         <div className="flex flex-wrap -mx-3 mb-6">
             <div className="w-full px-3">
                 <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" htmlFor="grid-password">
                     Description
                 </label>
                 <textarea rows="10" className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name='description' placeholder={editService[0]?.description} onChange={(e) => handleData(e)}> 
                 </textarea>
             </div>
             <div className="flex justify-between w-full px-3">
                 <button className="shadow bg-indigo-600 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-6 rounded" type="submit" onClick={(e) => edit_Service(e)}>
                     Edit Service
                 </button>
             </div>
         </div>
     </form>
      }
    </div>
  )
}

export default EditServices
