import Image from "next/image";
import { Camera } from "lucide-react";

interface ProfileImagePreviewProps {
  image: string;
  alt: string;
}

const ProfileImagePreview = ({ image, alt }: ProfileImagePreviewProps) => {
  return (
    <div className="group relative w-[200px] h-[200px] overflow-hidden rounded-full mx-auto cursor-pointer">
      <Image
        src={image}
        alt={alt}
        width={200}
        height={200}
        className="rounded-full object-cover"
      />

      {/* Hover Overlay */}
      <div
        className="
          absolute inset-0 bg-black/40 hover:bg-black/20 
          transition-all flex items-center justify-center 
          opacity-0 group-hover:opacity-100
        "
      >
        <Camera className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default ProfileImagePreview;
