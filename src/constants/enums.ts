export enum Routes {
  ROOT = "/",
  LISTSHOWS = "/admin/list-shows",
  LISTBOOKINGS = "/admin/list-bookings",
  ADDSHOWS = "/admin/add-shows",
  USERS = "/admin/users",
  ABOUT = "/about",
  CONTACT = "/contact",
  PROFILE = "/profile",
  ADMIN = "/admin",
}

export enum Pages {
  LOGIN = "/sign-in",
  Register = "/signup",
  MOVIES = "/movies",
  FAVORITE = "/favorite",
  ABOUT = "/about",
  CONTACT = "/contact",
  MYBOOKINGS = "/myBookings",
  SEATLAYOUT = "/seat-layout",
}

export const SHOWS_PER_PAGE = 5;
export const USERS_PER_PAGE = 5;
export const BOOKINGS_PER_PAGE = 5;

export const image_base_url: string =
  process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE_URL || "";

const PRODUCTION_DOMAIN = "https://quick-cinema-beige.vercel.app";

const DEVELOPMENT_DOMAIN = "http://localhost:3000";

export const DOMAIN =
  process.env.NODE_ENV === "production"
    ? PRODUCTION_DOMAIN
    : DEVELOPMENT_DOMAIN;
