import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  pages: number;
  pageNumber: number;
  route: string;
}

const Pagination = ({ pages, pageNumber, route }: PaginationProps) => {
  const pagesArray: number[] = [];
  for (let i = 1; i <= pages; i++) pagesArray.push(i);

  const prev = pageNumber - 1;
  const next = pageNumber + 1;

  return (
    <div className="flex items-center justify-center mt-7 max-w-full gap-3">
      <Link
        href={prev >= 1 ? `${route}?pageNumber=${prev}` : "#"}
        className={`font-light text-primary ${
          prev < 1 ? "cursor-not-allowed opacity-50" : ""
        }`}
        aria-disabled={prev < 1 ? "true" : "false"}
      >
        <ChevronLeft size={35} />
      </Link>

      {pagesArray.map((page) => (
        <Link
          href={`${route}?pageNumber=${page}`}
          className={`btn-link text-sm  ${
            pageNumber === page ? "active-btn" : ""
          }`}
          key={page}
        >
          {page}
        </Link>
      ))}

      <Link
        href={next <= pages ? `${route}?pageNumber=${next}` : "#"}
        className={`font-light text-primary ${
          next > pages ? "cursor-not-allowed opacity-50" : ""
        }`}
        aria-disabled={next > pages ? "true" : "false"}
      >
        <ChevronRight size={35} />
      </Link>
    </div>
  );
};

export default Pagination;
