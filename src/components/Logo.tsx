import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex gap-0 text-white text-[21px] sm:text-2xl font-extrabold">
      <Image
        src="/favicon.svg"
        alt="logo-img"
        width={50}
        height={50}
        className="w-7 h-7"
      />
      uickCinema
    </div>
  );
};

export default Logo;
