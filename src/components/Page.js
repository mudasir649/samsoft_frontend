import React from 'react';
import Package from "../components/Package";
import Sidebar from "../components/Sidebar";


function Page() {
  return (
    <div className="flex flex-row space-x-10 h-[1000px]">
      <Sidebar/>
      <Package/>
    </div>
  )
}

export default Page
