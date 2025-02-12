import React, { useEffect } from 'react'

const Map = () => {
    useEffect(()=>{
        const script= document.createElement('script');
        script.src= `https://maps.gomaps.pro/maps/api/js?key=AlzaSyIqMeoQwc2j25Gk0rScm2ezMwYtEraRzoG&libraries=geometry,places&callback=initMap`;
        script.async= true;
        document.head.appendChild(script);
        script.onload= () => {
            window.initMap= () => {
                const map= new window.google.maps.Map(document.getElementById('map'), {
                    center: {lat: 27.7172, lng: 85.3240},
                    zoom: 13,
                });

                const input= document.getElementById('pac-input');
                const autocomplete= new window.google.maps.places.Autocomplete(input);
                autocomplete.bindTo('bounds', map);
                autocomplete.addListener('place_changed', ()=> {
                    const place= autocomplete.getPlace();
                    if(!place.geometry) return;
                    if(place.geometry.viewport){
                        map.fitBounds(place.geometry.viewport);
                    } else{
                        map.setCenter(place.geometry.location);
                        map.setZoom(17);
                    }

                    new window.google.maps.Marker({
                        position: place.geometry.location,
                        map: map,
                    });
                });
            };
        };

        return() => {
            document.head.removeChild(script);
        };

    }, []);

    return(
        <div>
            <input id="pac-input" type="text" placeholder='Search for a place' style={{marginTop:'10px', padding:'5px', width:'300px'}} />
            <div id='map' style={{height:'400px', width:'100%'}}></div>
        </div>
    );
  
};

export default Map;
