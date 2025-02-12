import React from 'react'
import './Adoption.css';
import Navbar from '../Navbar/Navbar';
import Map from './Map';

const Adoption= ({user}) => {
    return(
        <div className="adoption-page">
            <Navbar user={user}/>
            <div className="banner-section">
                <div className="banner-text">
                <h1>Find Your New Best Friend</h1>
                <p>Browse our available dogs for adoption and give a pet a loving home.</p>
                </div>
                
            </div>
            <div className="map-heading">
                <h2>Find Nearby Adoption Center</h2>
            </div>
            <Map/>
        </div>
    );
};

export default Adoption;