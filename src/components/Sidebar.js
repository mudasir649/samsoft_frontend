import React from 'react';
import { useNavigate } from 'react-router-dom';

function Sidebar() {
  const navigate = useNavigate();
  const liStyle = "text-md cursor-pointer hover-gray-500";
  return (
    <div className='border-r-2 border-gray-500 mr-20'>
      <ul className='mt-10 mx-20 space-y-10'>
        <li className={liStyle} onClick={() => navigate("/")}>Services</li>
        <li className={liStyle} onClick={() => navigate("/package")}>Packages</li>
      </ul>
    </div>
  )
}

export default Sidebar
