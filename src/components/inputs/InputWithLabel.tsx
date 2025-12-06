"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { InputHTMLAttributes } from "react";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  className?: string;
  showCurrency?: boolean;
} & InputHTMLAttributes<HTMLInputElement>;

export function InputWithLabel<S>({
  fieldTitle,
  nameInSchema,
  className,
  showCurrency,
  ...props
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-base" htmlFor={nameInSchema}>
            {fieldTitle}
          </FormLabel>

          <FormControl>
            <div className="relative w-full">
              {showCurrency && props.type === "number" && (
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  $
                </span>
              )}

              <Input
                id={nameInSchema}
                className={`w-full focus:!border-primary focus:!outline-none focus:!ring-0 disabled:text-blue-500 dark:disabled:text-yellow-300 disabled:opacity-75 ${
                  showCurrency ? "ps-8" : ""
                } ${className}`}
                {...props}
                value={field.value ?? ""}
                onChange={(e) => {
                  const inputValue = e.target.value;

                  const value =
                    props.type === "number" && inputValue !== ""
                      ? Number(inputValue)
                      : inputValue;

                  field.onChange(value);
                }}
              />
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
