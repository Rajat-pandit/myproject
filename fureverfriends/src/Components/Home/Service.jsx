import React, { useState, useEffect} from 'react'
import './Service.css'

const services= [
    {
        title: 'Veterinary Service',
        description: 'The Veterinary Service in Furever Friends allows pet owners to manage their pets health needs with ease. Users can schedule and track vet appointments, receive reminders for regular check-ups, vaccinations, and treatments, and maintain a complete medical history for each pet. This service ensures pets receive timely care and allows owners to stay on top of their pets health needs, improving their overall well-being.',
        image: '/vet.png'
    },
    {
        title: 'Adoption',
        description: 'The Adoption Service on Furever Friends helps you find and adopt a pet in need of a home. You can browse through available pets, see their details like breed, age, and personality, and choose the one that best fits your family. Once you find a pet you like, you can apply to adopt and get in touch with the shelter or pet owner. The process is designed to be simple, making it easier for you to bring a new pet into your life.',
        image: '/adoption.png'
    },
    {
        title: 'Pet Health Management',
        description: 'Pet Health Management on Furever Friends helps pet owners keep track of their pets health and medical history. This service includes storing essential information such as vaccination records, medications, and emergency contacts. Additionally, it features an Emergency Card that ensures vital health details are accessible in urgent situations. With this service, you can easily manage and monitor your pet well-being, giving you peace of mind knowing that everything is organized and ready when needed.',
        image: '/PHM.png'
    },
];

const ServiceCarousel = ()=>{
    const [currentIndex, setCurrentIndex]= useState(0);
    useEffect(() =>{
        const interval= setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex +1)% services.length);
        },12000);
        return ()=> clearInterval(interval);
    }, []);
        const goToNext =() => {
            setCurrentIndex((prevIndex) => {
                let newIndex = prevIndex+1;
                if(newIndex>= services.length){
                    newIndex = 0;
                }
                return newIndex;
            });
        };

        const goToPrev =() => {
            setCurrentIndex((prevIndex) => {
                let newIndex = prevIndex -1;
                if(newIndex < 0){
                    newIndex= services.length-1;
                }
                return newIndex;
            });
        };

        return(
            <div className="carousel-container">
                <div className="carousel-slide" style={{transform: `translatex(-${currentIndex * 100}%)`}}>
                    {services.map((service, index) => (
                        <div  key={index} className="carousel-item">
                            <div className="carousel-content">
                                <div className="text-content">
                                    <h2>{service.title}</h2>
                                    <p>{service.description}</p>
                                </div>
                                <img src= {service.image} alt={service.title} className='service-image' />
                            </div>
                        </div>
                    ))}

                </div>
                <button onClick={goToPrev}>Prev</button>
                <button onClick={goToNext}>Next</button>
            </div>
        );
    };

    export default ServiceCarousel;