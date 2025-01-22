import React from 'react'
import {Navbar} from '../Navbar/Navbar'
import Aboutus from './Aboutus'

export const Home = ({user}) => {
  return (
    <div>
        <Navbar user={user}/>
        <Aboutus/>
    </div>
  )
}

export default Home;