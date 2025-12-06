"use client";

import { useFormContext } from "react-hook-form";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";

type Props<S> = {
  fieldTitle: string;
  nameInSchema: keyof S & string;
  message?: string;
  disabled?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
};

export function CheckboxWithLabel<S>({
  fieldTitle,
  nameInSchema,
  message,
  disabled = false,
  checked,
  onCheckedChange,
}: Props<S>) {
  const form = useFormContext();

  return (
    <FormField
      control={form.control}
      name={nameInSchema}
      render={({ field }) => (
        <FormItem className="w-full flex items-center gap-2">
          {message}

          <div className="flex items-center gap-2">
            <FormControl>
              <Checkbox
                id={nameInSchema}
                checked={
                  typeof checked === "boolean"
                    ? checked
                    : typeof field.value === "boolean"
                    ? field.value
                    : false
                }
                onCheckedChange={(checked: CheckedState) => {
                  const isChecked = checked === true;
                  field.onChange(isChecked);
                  if (onCheckedChange) {
                    onCheckedChange(isChecked);
                  }
                }}
                disabled={disabled}
              />
            </FormControl>
            <FormLabel className="text-base" htmlFor={nameInSchema}>
              {fieldTitle}
            </FormLabel>
          </div>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}
