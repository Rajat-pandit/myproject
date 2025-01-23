import React from 'react'
import {Navbar} from '../Navbar/Navbar'
import Aboutus from './Aboutus'
import Service from './Service';

export const Home = ({user}) => {
  return (
    <div>
        <Navbar user={user}/>
        <Aboutus/>
        <Service/>
    </div>
  )
}

export default Home;