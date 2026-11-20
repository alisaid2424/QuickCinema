const FeaturedSkeleton = () => {
  return (
    <div className="container-section overflow-hidden">
      <div className="relative flex items-center justify-between pt-20 pb-10">
        <div className="h-5 w-24 rounded-full bg-gray-800 animate-pulse" />
        <div className="h-4 w-16 rounded-full bg-gray-800 animate-pulse" />
      </div>

      <div className="grid min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 my-7 pb-8 w-full">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="w-full mx-auto flex flex-col p-3 bg-gray-800 rounded-2xl"
          >
            <div className="rounded-lg h-52 w-full bg-gray-700/50 animate-pulse" />

            <div className="h-4 w-3/4 mt-3 rounded-full bg-gray-700/50 animate-pulse" />

            <div className="h-3 w-1/2 mt-2 rounded-full bg-gray-700/50 animate-pulse" />

            <div className="flex items-center justify-between mt-5 pb-3">
              <div className="h-9 w-28 rounded-full bg-gray-700/50 animate-pulse" />
              <div className="h-4 w-10 rounded-full bg-gray-700/50 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedSkeleton;
