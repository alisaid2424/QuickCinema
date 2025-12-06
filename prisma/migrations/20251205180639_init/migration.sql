-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "clerkUserId" TEXT NOT NULL,
    "password" TEXT,
    "name" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movie" (
    "id" TEXT NOT NULL,
    "tmdbId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "posterPath" TEXT NOT NULL,
    "backdropPath" TEXT NOT NULL,
    "releaseDate" TEXT NOT NULL,
    "originalLanguage" TEXT,
    "tagline" TEXT,
    "voteAverage" DOUBLE PRECISION NOT NULL,
    "runtime" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cast" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "profilePath" TEXT,

    CONSTRAINT "Cast_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Show" (
    "id" TEXT NOT NULL,
    "showDateTime" TIMESTAMP(3) NOT NULL,
    "showPrice" DOUBLE PRECISION NOT NULL,
    "occupiedSeats" JSONB NOT NULL DEFAULT '{}',
    "movieId" TEXT NOT NULL,

    CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Booking" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bookedSeats" TEXT[],
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "showId" TEXT NOT NULL,

    CONSTRAINT "Booking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MovieGenres" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MovieCasts" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_MovieCasts_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Movie_tmdbId_key" ON "Movie"("tmdbId");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_name_key" ON "Genre"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Cast_name_key" ON "Cast"("name");

-- CreateIndex
CREATE INDEX "_MovieGenres_B_index" ON "_MovieGenres"("B");

-- CreateIndex
CREATE INDEX "_MovieCasts_B_index" ON "_MovieCasts"("B");

-- AddForeignKey
ALTER TABLE "Show" ADD CONSTRAINT "Show_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieGenres" ADD CONSTRAINT "_MovieGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieCasts" ADD CONSTRAINT "_MovieCasts_A_fkey" FOREIGN KEY ("A") REFERENCES "Cast"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MovieCasts" ADD CONSTRAINT "_MovieCasts_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
