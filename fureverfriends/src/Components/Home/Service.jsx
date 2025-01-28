import React, { useState, useEffect} from 'react'
import './Service.css'

const services= [
    {
        title: 'Veterinary Service',
        description: 'Veterinary Service in Furever Friends allows pet owners to schedule vet appointments, receive reminders for check-ups and treatments, and maintain a medical history for each pet, ensuring timely care and better health management. This service helps pet owners stay proactive in managing their pets well-being for a healthier, happier life.',
        image: '/vet.png'
    },
    {
        title: 'Adoption',
        description: 'Adoption Service on Furever Friends makes it easy to find and adopt a pet. Browse available pets, view their details, and apply to adopt. The service connects you with shelters or pet owners, simplifying the adoption process and helping you bring a new pet into your home.',
        image: '/adoption.png'
    },
    {
        title: 'Pet Health Management',
        description: 'Pet Health Management on Furever Friends allows pet owners to track their pets health and medical history. It stores key information like vaccinations, medications, and emergency contacts, and includes an Emergency Card for quick access in urgent situations. It ensures easy management and monitoring of your pets well-being.',
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

    const goToSlide= (index) => {
        setCurrentIndex(index);
    };
    return (
        <div className="carousel-container">
            <div className="carousel-slide" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {services.map((service, index) => (
                    <div key={index} className="carousel-item">
                        <div className="carousel-content">
                            <div className="text-content">
                                <h2>{service.title}</h2>
                                <p>{service.description}</p>
                            </div>
                            <img src={service.image} alt={service.title} className="service-image" />
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Dots for navigation */}
            <div className="carousel-dots">
                {services.map((_, index) => (
                    <span
                        key={index}
                        className={`dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)} // Handle dot click to change slide
                    ></span>
                ))}
            </div>
        </div>
    );
};

export default ServiceCarousel;


    
