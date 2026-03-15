import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn, parseDateInput } from "@/lib/utils";
import { certificationSchema, CertificationValues } from "@/lib/validation";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { zodResolver } from "@hookform/resolvers/zod";
import { isEqual } from "lodash";
import { GripHorizontal } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { FormCompProps, useEditorContext } from "../../contexts/editor-context";

function _CertificationsForm({
  data,
  onChange,
}: FormCompProps<"certifications">) {
  const form = useForm<CertificationValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      certifications: (data?.certifications as any) ?? [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const certifications = value.certifications?.filter(
        (c) => c !== undefined,
      );
      const hasChanged = !isEqual(certifications, data.certifications);
      if (!hasChanged) return;
      onChange({
        id: "certifications",
        data: {
          certifications: structuredClone(certifications ?? []),
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [form, data, onChange]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "certifications",
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((field) => field.id === active.id);
      const newIndex = fields.findIndex((field) => field.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <>
      <Form {...form}>
        <form className="space-y-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <SortableContext
              items={fields}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field, index) => (
                <CertificationItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                />
              ))}
            </SortableContext>
          </DndContext>
          <div className="flex justify-center">
            <Button
              type="button"
              onClick={() =>
                append({
                  name: "",
                  issuer: "",
                  issueDate: "",
                  expiryDate: "",
                  credentialUrl: "",
                })
              }
            >
              Add certification
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

interface CertificationItemProps {
  id: string;
  form: UseFormReturn<CertificationValues>;
  index: number;
  remove: (index: number) => void;
}

function CertificationItem({
  id,
  form,
  index,
  remove,
}: CertificationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <div
      className={cn(
        "space-y-3 rounded-md border bg-background p-3",
        isDragging && "relative z-50 cursor-grab shadow-xl",
      )}
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <div className="flex justify-between gap-2">
        <span className="font-semibold">Certification {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`certifications.${index}.name`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input
                {...field}
                autoFocus
                placeholder="AWS Solutions Architect"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`certifications.${index}.issuer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuing organization</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Amazon Web Services" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-2 gap-3">
        <FormField
          control={form.control}
          name={`certifications.${index}.issueDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Issue date</FormLabel>
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
          name={`certifications.${index}.expiryDate`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expiry date</FormLabel>
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
        name={`certifications.${index}.credentialUrl`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Credential URL</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="https://www.credly.com/badges/..."
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button variant="destructive" type="button" onClick={() => remove(index)}>
        Remove
      </Button>
    </div>
  );
}

export default function CertificationsForm() {
  const { stepper, updateSection } = useEditorContext();
  if (stepper.current?.id !== "certifications") return null;
  const certStep = stepper.steps.find((step) => step.id === "certifications");
  if (!certStep) return null;
  return (
    <_CertificationsForm
      data={certStep.data ?? { certifications: [] }}
      onChange={updateSection}
    />
  );
}
