"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { parseDateInput } from "@/lib/utils";
import { otherFieldSchema, OtherFieldValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { OtherFieldStep, useEditorContext } from "../../contexts/editor-context";

interface CustomSectionFormProps {
  step: OtherFieldStep;
  onChange: (step: Pick<OtherFieldStep, "id" | "data">) => void;
}

function _CustomSectionForm({ step, onChange }: CustomSectionFormProps) {
  const data = step.data as OtherFieldValues | undefined;

  const form = useForm<NonNullable<OtherFieldValues>>({
    resolver: zodResolver(otherFieldSchema as any),
    defaultValues: {
      title: data?.title ?? "",
      subtitle: data?.subtitle ?? "",
      description: data?.description ?? "",
      startDate: data?.startDate ?? "",
      endDate: data?.endDate ?? "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const hasChanged = !isEqual(value, data);
      if (!hasChanged) return;
      onChange({
        id: step.id,
        data: structuredClone(value) as any,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, data, onChange, step.id]);

  return (
    <Form {...form}>
      <form className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} autoFocus placeholder="e.g. Volunteer Work" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subtitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Subtitle{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Input {...field} placeholder="e.g. Organization name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-3">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={parseDateInput(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End date</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="date"
                    value={parseDateInput(field.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Description{" "}
                <span className="font-normal text-muted-foreground">
                  (optional)
                </span>
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  rows={4}
                  placeholder="Briefly describe this section…"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export default function CustomSectionForm() {
  const { stepper, updateSection } = useEditorContext();
  const step = stepper.current;

  if (!step?.id.startsWith("other-field-")) return null;
  const otherFieldStep = stepper.steps.find((s) => s.id === step.id) as
    | OtherFieldStep
    | undefined;
  if (!otherFieldStep) return null;

  return <_CustomSectionForm step={otherFieldStep} onChange={updateSection} />;
}
