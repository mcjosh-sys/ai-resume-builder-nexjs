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
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/hooks/use-modal";
import { useNavigate } from "@/hooks/use-navigate";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { PropsWithChildren, useEffect } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { createResume } from "../../actions/resume.actions";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().optional(),
});

const FormDiv: React.FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-col gap-2">{children}</div>
);

const FormSpan: React.FC<{ label: string }> = ({ label = "" }) => (
  <FormLabel className="text-muted-foreground text-sm capitalize">
    {label}
  </FormLabel>
);

export const CreateResumeModal = ({ modal }: { modal: Modal }) => {
  const navigate = useNavigate();
  const { user } = useUser();

  const form = useForm<z.infer<typeof formSchema>>({
    mode: "onChange",
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (modal.isOpen) {
      form.reset({
        title: `My-Resume-${Date.now().toString().substring(6, 13)}`,
        description: "",
      });
    }
  }, [modal.isOpen]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.close();
    }
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (user) {
      const resume = await createResume(data);
      navigate(`/editor?id=${resume.id}`);
      handleOpenChange(false);
    }
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent
        showCloseButton={!modal.isLoading}
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
        className="w-full sm:max-w-md max-w-md m-4"
      >
        <DialogHeader>
          <DialogTitle className="text-xl mt-4">Create New Resume</DialogTitle>
          <DialogDescription>Create a new resume.</DialogDescription>
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
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormDiv>
                      <FormSpan label="Description" />
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Enter resume decription"
                          className="resize-none h-24"
                        />
                      </FormControl>
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
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
