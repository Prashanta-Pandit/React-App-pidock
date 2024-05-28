import '../App.css'
import React from "react";
import {Outlet} from 'react-router-dom';
import Navbar from "./Nav";
import Footer from "./Footer";

export default function Layout(){
    return(
       <>
         <Navbar />
           <Outlet />
         <Footer />
       </>
    )
}