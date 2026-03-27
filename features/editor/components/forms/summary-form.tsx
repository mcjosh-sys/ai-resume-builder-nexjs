import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { summarySchema, SummaryValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditorContext } from "../../contexts/editor-context";
import { FormCompProps } from "../../types/editor-resume.type";

function _SummaryForm({ data, onChange }: FormCompProps<"summary">) {
  const form = useForm<SummaryValues>({
    resolver: zodResolver(summarySchema),
    defaultValues: {
      summary: data?.summary || "",
    },
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      const hasChanged = values.summary !== data.summary;
      if (!hasChanged) return;
      onChange({
        id: "summary",
        data: {
          summary: values.summary,
        },
      });
    });
    return unsubscribe;
  }, [form, data, onChange]);

  return (
    <>
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional summary</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="A brief, engaging text about yourself"
                    className="h-28 resize-none"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}

export default function SummaryForm() {
  const { stepper, updateSection } = useEditorContext();

  if (stepper.current?.id !== "summary") return null;

  const data = stepper.steps.find((section) => section.id === "summary")?.data;

  return <_SummaryForm data={data ?? {}} onChange={updateSection} />;
}
