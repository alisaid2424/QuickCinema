import { ArrowRight, Calendar1Icon, ClockIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Pages } from "@/constants/enums";

const HeroSection = () => {
  return (
    <div className="relative bg-cover bg-[url('/backgroundImage.jpg')] bg-center h-screen -mt-[90px]">
      <div className="overlay absolute inset-0 w-full h-full bg-black/60" />
      <div className="relative container-section flex flex-col items-start justify-center h-full gap-4 ">
        <Image
          src="/marvelLogo-D2PF-9pQ.svg"
          alt="maravel-logo"
          width={200}
          height={100}
          className="max-h-11 lg:h-11"
        />

        <h1 className="text-4xl sm:text-5xl md:text-[70px] md:leading-[1.1] font-semibold max-w-md">
          Guardians <br />
          of the Galaxy
        </h1>

        <div className="flex items-center gap-3 sm:gap-4 text-gray-300 max-sm:text-sm">
          <span>Action | Adventure | Sci-Fi</span>

          <div className="flex items-center gap-1">
            <Calendar1Icon className="w-4 h-4" /> {new Date().getFullYear()}
          </div>

          <div className="flex items-center gap-1">
            <ClockIcon className="w-4 h-4" /> 2h 9m
          </div>
        </div>

        <p className="max-w-md text-gray-300">
          In a post-apocalyptic world where cities ride on wheels and consume
          each other to survive, two people meet in London and try to stop a
          conspiracy.
        </p>

        <Link
          href={Pages.MOVIES}
          className="main-btn group flex items-center gap-1 rounded-full mt-3"
        >
          Explore Movies
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-all duration-300" />
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
