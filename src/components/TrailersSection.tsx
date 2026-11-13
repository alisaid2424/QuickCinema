"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayCircleIcon } from "lucide-react";
import BlurCircle from "./BlurCircle";
import { dummyTrailers } from "@/constants/data";

const thumbnailUrl = (videoId: string) =>
  `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

const TrailersSection = () => {
  const [selectedId, setSelectedId] = useState(dummyTrailers[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const selectTrailer = (videoId: string) => {
    setSelectedId(videoId);
    setIsPlaying(false);
  };

  return (
    <div className="px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden">
      <h2 className="text-gray-300 font-medium text-lg max-w-[960px] mx-auto">
        Trailers
      </h2>

      <div className="relative mt-6 mx-auto w-full aspect-video max-w-[960px]">
        <BlurCircle top="-50px" right="-50px" />

        {isPlaying ? (
          <iframe
            className="absolute inset-0 w-full h-full rounded-lg"
            src={`https://www.youtube-nocookie.com/embed/${selectedId}?autoplay=1`}
            title="Movie trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            aria-label="Play trailer"
            onClick={() => setIsPlaying(true)}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            <Image
              src={thumbnailUrl(selectedId)}
              alt="trailer"
              fill
              sizes="(max-width: 960px) 100vw, 960px"
              className="rounded-lg object-cover brightness-75 group-hover:brightness-90 transition"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-12 h-12 md:w-16 md:h-16 -translate-x-1/2 -translate-y-1/2"
            />
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4 md:gap-8 mt-7 max-w-3xl mx-auto group">
        {dummyTrailers.map((videoId) => (
          <button
            key={videoId}
            type="button"
            aria-label="Select trailer"
            onClick={() => selectTrailer(videoId)}
            className={`relative aspect-video rounded-lg overflow-hidden hover:-translate-y-1 transition duration-300 cursor-pointer ${
              selectedId === videoId
                ? "opacity-100"
                : "group-hover:opacity-50 hover:opacity-100"
            }`}
          >
            <Image
              src={thumbnailUrl(videoId)}
              alt="trailer thumbnail"
              fill
              sizes="(max-width: 640px) 22vw, 176px"
              className="object-cover brightness-75"
            />
            <PlayCircleIcon
              strokeWidth={1.6}
              className="absolute top-1/2 left-1/2 w-5 h-5 md:w-8 md:h-8 -translate-x-1/2 -translate-y-1/2"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailersSection;
