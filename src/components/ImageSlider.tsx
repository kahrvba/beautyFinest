"use client";

import {useState, useEffect, JSX} from "react";
import Image from "next/image";
import { StaticImageData } from "next/image";
import image1 from "/public/image1.png";
import image2 from "/public/image2.png";
import image3 from "/public/image3.png";
import image4 from "/public/image4.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Interface for image data
interface ImageData {
    src: StaticImageData;
}

// Image data array
const images: ImageData[] = [
    {
        src: image1,
    },
    {
        src: image2,
    },
    {
        src: image3,
    },
    {
        src: image4,
    }
];

export default function ImageSlider(): JSX.Element {
    // State to keep track of the current image index
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    // State to determine if the image is being hovered over
    const [isHovered, setIsHovered] = useState<boolean>(false);

    // Function to show the previous slide
    const prevSlide = (): void => {
        setCurrentIndex(
            (prevIndex) => (prevIndex - 1 + images.length) % images.length
        );
    };

    // Function to show the next slide
    const nextSlide = (): void => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // useEffect hook to handle automatic slide transition
    useEffect(() => {
        // Start interval for automatic slide change if not hovered
        if (!isHovered) {
            const interval = setInterval(() => {
                nextSlide();
            }, 3000);

            // Cleanup the interval on component unmount
            return () => {
                clearInterval(interval);
            };
        }
    }, [isHovered]);

    // Handle mouse over event
    const handleMouseOver = (): void => {
        setIsHovered(true);
    };

    // Handle mouse leave event
    const handleMouseLeave = (): void => {
        setIsHovered(false);
    };

    return (
        (<div className="relative mx-auto mt-">
            <div
                className="relative h-[460px] group w-ful"
                onMouseOver={handleMouseOver}
                onMouseLeave={handleMouseLeave}
            >
                <Image
                    src={images[currentIndex].src}
                    alt={`Slider Image ${currentIndex + 1}`}
                    className="transition-all duration-500 ease-in-out cursor-pointer"
                    style={{
                        objectFit: "cover"
                    }} />
            </div>
            <button
                className="absolute left-0 top-1/2 transform  rounded-xl hover:bg-[#1a222f]  -mt-[10px] -translate-y-1/2 bg-inherit text-white p-2 group"
                onClick={prevSlide}
            >
                <ChevronLeft className="text-gray-400 group-hover:text-white" />
            </button>
            <button
                className="absolute right-0 top-1/2 transform  rounded-xl hover:bg-[#1a222f] -mt-[10px] -translate-y-1/2 bg-inherit text-white p-2 group"
                onClick={nextSlide}
            >
                <ChevronRight className="text-gray-400 group-hover:text-white" />
            </button>
            <div className="flex justify-center mt-4">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`h-1 w-10 mx-1 ${
                            index === currentIndex
                                ? "bg-[#beff46] rounded-xl"
                                : "bg-gray-300 rounded-xl"
                        } transition-all duration-500 ease-in-out`}
                    ></div>
                ))}
            </div>
        </div>)
    );
}