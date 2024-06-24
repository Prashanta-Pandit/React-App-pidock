import '../App.css'
import React from "react";
import {Outlet} from 'react-router-dom';
import Navbar from "./TopNavBar/Nav";

export default function Layout(){
    return(
       <>
         <Navbar />
         <Outlet /> {/* This is a section where all other compoments we call viua App.jsx */}
       </>
    )
}