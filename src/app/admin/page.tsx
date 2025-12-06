import {
  ChartLineIcon,
  CircleDollarSignIcon,
  PlayCircleIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react";

import Title from "./_components/Title";
import BlurCircle from "@/components/BlurCircle";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";
import dateFormat from "@/lib/dateFormat";
import { getDashboardData } from "@/server/db/dashboardData";
import { image_base_url } from "@/constants/enums";

const AdminPage = async () => {
  const dashboardData = await getDashboardData();

  const dashboardCards = [
    {
      title: "Total Bookings",
      value: dashboardData.totalBookings || 0,
      icon: ChartLineIcon,
    },
    {
      title: "Total Revenue",
      value: formatCurrency(dashboardData.totalRevenue || 0),
      icon: CircleDollarSignIcon,
    },
    {
      title: "Active Shows",
      value: dashboardData.activeShows.length || 0,
      icon: PlayCircleIcon,
    },
    {
      title: "Total Users",
      value: dashboardData.totalUser || 0,
      icon: UsersIcon,
    },
  ];

  return (
    <>
      <Title text1="Admin" text2="Dashboard" />

      <div className="relative flex flex-col gap-4 mt-6">
        <BlurCircle top="-100px" left="0" />

        <div className="flex flex-wrap gap-4 w-full">
          {dashboardCards.map((card, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between px-4 py-3 bg-primary/10 border border-primary/20 rounded-md max-w-52 w-full"
            >
              <div className="">
                <h3 className="text-sm">{card.title}</h3>
                <p className="text-xl font-medium mt-1">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-lg font-medium">Active Shows</p>

        <div className="relative mt-4 max-w-6xl">
          <BlurCircle top="100px" left="-10%" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {dashboardData.activeShows.map((show) => (
              <div
                key={show.id}
                className="rounded-lg overflow-hidden pb-3 bg-primary/10 border border-primary/20 hover:-translate-y-1 transition duration-300"
              >
                <Image
                  src={image_base_url + (show.movie.posterPath ?? "")}
                  alt={`img-${show.movie.title}`}
                  width={300}
                  height={400}
                  className="h-60 w-full object-cover"
                />
                <p className="font-medium p-2 truncate">{show.movie.title}</p>

                <div className="flex items-center justify-between px-2">
                  <p className="text-lg font-medium">
                    {formatCurrency(show.showPrice)}
                  </p>
                  <p className="flex items-center gap-1 text-sm text-gray-400 mt-1 pr-1">
                    <StarIcon className="w-4 h-4 text-primary fill-primary" />
                    {show.movie.voteAverage.toFixed(1)}
                  </p>
                </div>

                <p className="px-2 pt-2 text-sm text-gray-500">
                  {dateFormat(show.showDateTime)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminPage;
