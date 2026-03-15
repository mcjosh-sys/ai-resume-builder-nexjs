import {
  FaAirbnb,
  FaAmazon,
  FaGoogle,
  FaMicrosoft,
  FaSpotify,
} from "react-icons/fa";

export const BrandSection = () => {
  const brands = [
    { name: "Google", icon: <FaGoogle size={24} /> },
    { name: "Amazon", icon: <FaAmazon size={24} /> },
    { name: "Microsoft", icon: <FaMicrosoft size={24} /> },
    { name: "Spotify", icon: <FaSpotify size={24} /> },
    { name: "Airbnb", icon: <FaAirbnb size={24} /> },
  ];

  return (
    <section className="w-full bg-muted py-16 px-4">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        {/* Header Text */}
        <h2 className="text-[#a5b4fc] text-xs font-semibold tracking-[0.2em] uppercase mb-10 text-center">
          Our users get hired at top companies
        </h2>

        {/* Logo Container */}
        <div className="w-full flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale brightness-200 contrast-75">
          {brands.map((brand) => (
            <div key={brand.name} className="flex items-center justify-center">
              {brand.icon}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
