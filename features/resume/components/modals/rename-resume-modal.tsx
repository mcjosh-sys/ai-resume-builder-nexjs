"use client";

import { LoadingButton } from "@/components/loading-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldSet } from "@/components/ui/field";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { renameResume } from "../../actions/resume.actions";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
});

const FormDiv: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const FormSpan: React.FC<{ label: string }> = ({ label = "" }) => (
  <FormLabel className="text-muted-foreground text-sm capitalize">
    {label}
  </FormLabel>
);

export type RenameResumeModalProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  resumeId: string;
  initialTitle: string;
  onRenamed?: (id: string, newTitle: string) => void;
};

export const RenameResumeModal = ({
  isOpen,
  onOpenChange,
  resumeId,
  initialTitle,
  onRenamed,
}: RenameResumeModalProps) => {
  const router = useRouter();
  
  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialTitle,
    },
  });

  useEffect(() => {
    if (isOpen) {
      form.reset({
        title: initialTitle || `My-Resume-${Date.now().toString().substring(6, 13)}`,
      });
    }
  }, [isOpen, initialTitle, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    await renameResume(resumeId, data.title);
    onRenamed?.(resumeId, data.title);
    router.refresh();
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={!form.formState.isSubmitting}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full sm:max-w-md max-w-md m-4"
      >
        <DialogHeader>
          <DialogTitle className="text-xl mt-4">Rename Resume</DialogTitle>
          <DialogDescription>Enter a new title for this resume.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet disabled={form.formState.isSubmitting}>
              <FormField
                name="title"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormDiv>
                      <FormSpan label="Title" />
                      <FormControl>
                        <Input {...field} placeholder="Enter resume title" />
                      </FormControl>
                      <FormMessage />
                    </FormDiv>
                  </FormItem>
                )}
              />
            </FieldSet>
            <DialogFooter>
              <LoadingButton
                type="submit"
                isLoading={form.formState.isSubmitting}
                className="w-full mt-4"
              >
                Save Changes
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
