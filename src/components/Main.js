import React from 'react'
import Services from "../components/Services";
import Sidebar from "../components/Sidebar";

function Main() {
  return (
    <div className="flex flex-row space-x-10 h-[1000px]">
      <Sidebar/>
      <Services/>
    </div>
  )
}

export default Main
