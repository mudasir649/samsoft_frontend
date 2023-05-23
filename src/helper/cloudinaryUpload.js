import { api } from "./Api";

export default async function uploadToCloudinary(filePath){
    const formData = new FormData();

    formData.append('file', filePath);
    formData.append('upload_preset', 'ecommerce');
    const data = await api.post('https://api.cloudinary.com/v1_1/dehiep9bk/image/upload', formData).then(res=> res.data);
    return data;
}