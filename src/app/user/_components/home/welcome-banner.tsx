import type React from "react";
import { useEffect, useState } from "react";

const HotelSkeleton = () => {
  return (
    <div className={`mb-6 overflow-hidden rounded-lg bg-cream p-4`}>
      <div className="mb-3 h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
      <div className="mb-3 h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
      <div className="relative mb-3 h-60 overflow-hidden rounded-lg">
        <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
      </div>
    </div>
  );
};

interface WelcomeBannerProps {
  hotelId: string;
  hotelName: string;
  hotelStreet: string;
  hotelCity: string;
  hotelState: string;
  banners: { bannerImage: string; bannerText: string }[] | undefined;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({
  hotelName,
  hotelStreet,
  hotelCity,
  hotelState,
  banners,
}: WelcomeBannerProps) => {
  if (!banners) return <HotelSkeleton />;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % banners?.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [banners?.length]);

  return (
    <div className="mb-6 overflow-hidden rounded-lg bg-cream p-4">
      <h1 className="text-lg font-medium">
        Welcome to <span className="text-brown">{hotelName}</span>
      </h1>
      <p className="mb-3 text-sm">
        {hotelStreet}, {hotelCity}, {hotelState}
      </p>

      <div className="relative mb-3 h-60 overflow-hidden rounded-lg">
        {banners?.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${banner.bannerImage}`}
              alt={`${hotelName} Banner`}
              className="absolute inset-0 h-full w-full object-cover"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
              <p className="text-sm text-white">{banner.bannerText}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WelcomeBanner;
