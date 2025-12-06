"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShowSchema, TShowSchema } from "@/zod-schemas/show";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import Image from "next/image";
import { useState } from "react";
import { CheckIcon, DeleteIcon, LoaderCircle, StarIcon } from "lucide-react";
import { InputWithLabel } from "@/components/inputs/InputWithLabel";
import { MovieTMDB } from "@/types/movie";
import { image_base_url, Routes } from "@/constants/enums";
import KConverter from "@/lib/KConverter";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addShow } from "@/server/actions/show";

const AddShowForm = ({ movies }: { movies: MovieTMDB[] }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [datetimeInput, setDatetimeInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TShowSchema>({
    resolver: zodResolver(ShowSchema),
    mode: "onBlur",
    defaultValues: {
      movieId: "",
      price: 0,
      times: [],
    },
  });

  const { control, watch, setValue } = form;
  const { fields, append, remove } = useFieldArray({ control, name: "times" });

  const selectedMovie = watch("movieId");

  const handleAddDateTime = () => {
    if (!datetimeInput) return;
    const [date, time] = datetimeInput.split("T");
    if (!date || !time) return;
    append({ date, time });
    setDatetimeInput("");
  };

  const onSubmit = async (data: TShowSchema) => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Call server action
      const res = await addShow(data);

      if (res.status === 201) {
        toast({
          title: "Success! 🎉",
          description: res.message,
          className: "bg-green-100 text-green-600",
        });
        router.push(`${Routes.LISTSHOWS}?pageNumber=1`);
      } else {
        toast({
          title: "Error",
          description: res.message,
          className: "bg-red-100 text-red-600",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Something went wrong.",
        className: "bg-red-100 text-red-600",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Movie Selection */}
        <FormField
          control={form.control}
          name="movieId"
          render={() => (
            <FormItem>
              <div className="overflow-x-auto pb-4">
                <div className="group flex flex-wrap gap-4 mt-4 w-max">
                  {movies.map((movie) => (
                    <div
                      key={movie.id}
                      className={`relative max-w-40 cursor-pointer group-hover:[&:not(:hover)]:opacity-40 hover:-translate-y-1 transition duration-300`}
                      onClick={() => setValue("movieId", movie.id.toString())}
                    >
                      <div className="relative rounded-lg overflow-hidden">
                        <Image
                          src={image_base_url + (movie.poster_path ?? "")}
                          alt={`img-${movie.title}`}
                          className="w-full object-cover brightness-90"
                          width={300}
                          height={400}
                        />
                        <div className="text-sm flex items-center justify-between p-2 bg-black/70 w-full absolute bottom-0 left-0">
                          <p className="flex items-center gap-1 text-gray-400">
                            <StarIcon className="w-4 h-4 text-primary fill-primary" />
                            {movie.vote_average.toFixed(1)}
                          </p>
                          <p className="text-gray-300">
                            {KConverter(movie.vote_count)} Votes
                          </p>
                        </div>
                      </div>

                      {selectedMovie === movie.id.toString() && (
                        <div className="absolute top-2 right-2 flex items-center justify-center bg-primary w-6 h-6 rounded">
                          <CheckIcon
                            className="w-4 h-4 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                      )}

                      <p className="font-medium truncate">{movie.title}</p>
                      <p className="text-gray-400 text-sm">
                        {movie.release_date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Show Price */}
        <div className="max-w-xs w-full">
          <InputWithLabel<TShowSchema>
            fieldTitle="Show Price"
            nameInSchema="price"
            type="number"
            placeholder="Enter Show Price"
            min={0}
            showCurrency={true}
          />
        </div>

        {/* Date Time Selection */}
        <div className="max-w-xs w-full">
          <label className="block text-sm font-medium mb-2">
            Select Date and Time
          </label>

          <div className="inline-flex max-sm:flex-wrap gap-3 border border-gray-600 max-sm:p-2 p-1 pl-3 rounded-lg">
            <input
              type="datetime-local"
              value={datetimeInput}
              onChange={(e) => setDatetimeInput(e.target.value)}
              className="outline-none rounded-md bg-transparent"
            />

            <Button
              type="button"
              onClick={handleAddDateTime}
              className="bg-primary/80 text-white px-3 py-2 text-sm rounded-lg hover:bg-primary transition-all"
            >
              Add Time
            </Button>
          </div>

          {/* Times Error */}
          <div className="text-red-500 text-sm mt-1">
            {form.formState.errors.times?.message}
          </div>
        </div>

        {/* Display Selected Times */}
        {fields.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-2">Selected Date-Time</h2>

            <ul className="space-y-3">
              {fields.map((item, index) => (
                <li key={item.id}>
                  <div className="text-sm flex items-center gap-2 border border-primary px-2 py-1 rounded w-fit">
                    <span>
                      {item.date} — {item.time}
                    </span>

                    <DeleteIcon
                      width={15}
                      className="ml-2 text-red-500 hover:text-red-700 cursor-pointer transition"
                      onClick={() => remove(index)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit */}
        <Button size="lg" type="submit" disabled={isLoading} className="mt-6">
          {isLoading ? <LoaderCircle className="animate-spin" /> : "Add Show"}
        </Button>
      </form>
    </Form>
  );
};

export default AddShowForm;
