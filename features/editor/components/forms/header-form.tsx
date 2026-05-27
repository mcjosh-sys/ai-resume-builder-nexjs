"use client";

import { ProfilePhotoSelector } from "@/components/profile-photo-selector";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@/components/ui/combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { headerSchema, HeaderValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Fragment, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useEditorContext } from "../../contexts/editor-context";
import { FormCompProps } from "../../types/editor-resume.type";

const CREATE_NEW = "__create_new__";

function _HeaderForm({ data, onChange }: FormCompProps<"header">) {
  const form = useForm<HeaderValues>({
    resolver: zodResolver(headerSchema),
    defaultValues: {
      firstName: data.firstName ?? "",
      lastName: data.lastName ?? "",
      jobTitle: data.jobTitle ?? [],
      city: data.city ?? "",
      country: data.country ?? "",
      phone: data.phone ?? "",
      email: data.email ?? "",
      photo: undefined,
    },
  });

  const [jobTitleInput, setJobTitleInput] = useState("");
  const [jobTitles, setJobTitles] = useState<string[]>([]);
  const showCreate =
    jobTitleInput.trim().length > 0 &&
    !data.jobTitle?.some(
      (t) => t.toLowerCase() === jobTitleInput.trim().toLowerCase(),
    );

  const anchor = useComboboxAnchor();

  const handleJobTitleChange = (
    field: { onChange: (value: string[]) => void },
    value: string[],
  ) => {
    let updated = [...value];

    let lastValue = updated[updated.length - 1];

    if (lastValue === CREATE_NEW) {
      const cleanValue = jobTitleInput.trim();
      setJobTitles((prev) => [...prev, cleanValue]);

      updated[updated.length - 1] = cleanValue;
    }

    field.onChange(updated);
  };

  useEffect(() => {
    const subscription = form.watch(async (value) => {
      const { links, ...rest } = value;
      const isValid = await form.trigger();
      if (!isValid) return;
      onChange({
        id: "header",
        data: {
          ...data,
          ...rest,
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [form, data, onChange]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-3">
          <div className="w-full flex items-center justify-center">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Photo</FormLabel>
                  <FormControl>
                    <ProfilePhotoSelector
                      value={field.value ?? data.photoUrl}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <FormField
            control={form.control}
            name="jobTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job title</FormLabel>
                <FormControl>
                  <Combobox
                    multiple
                    autoHighlight
                    value={field.value}
                    items={jobTitles}
                    onInputValueChange={setJobTitleInput}
                    onValueChange={(value) =>
                      handleJobTitleChange(field, value)
                    }
                  >
                    <ComboboxChips ref={anchor} className="w-full">
                      <ComboboxValue>
                        {(values) => (
                          <Fragment>
                            {values.map((value: string) => (
                              <ComboboxChip key={value}>{value}</ComboboxChip>
                            ))}
                            <ComboboxChipsInput />
                          </Fragment>
                        )}
                      </ComboboxValue>
                    </ComboboxChips>
                    <ComboboxContent anchor={anchor}>
                      {/* <ComboboxEmpty>Type to search...</ComboboxEmpty> */}
                      <ComboboxList>
                        {(item) => (
                          <ComboboxItem key={item} value={item}>
                            {item}
                          </ComboboxItem>
                        )}
                      </ComboboxList>
                      {showCreate && (
                        <ComboboxItem value={CREATE_NEW}>
                          Create "{jobTitleInput}"
                        </ComboboxItem>
                      )}
                    </ComboboxContent>
                  </Combobox>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} type="tel" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A brief, engaging text about yourself"
                    className="h-24 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
        </form>
      </Form>
    </>
  );
}

export const HeaderForm = () => {
  const { stepper, updateSection } = useEditorContext();

  if (stepper.current?.id !== "header") return null;

  const data = stepper.steps.find((section) => section.id === "header")?.data;

  return <_HeaderForm data={data ?? {}} onChange={updateSection} />;
};
