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
import { Textarea } from "@/components/ui/textarea";
import { cn, parseDateInput } from "@/lib/utils";
import { awardSchema, AwardValues } from "@/lib/validation";
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

function _AwardsForm({ data, onChange }: FormCompProps<"awards">) {
  const form = useForm<AwardValues>({
    resolver: zodResolver(awardSchema),
    defaultValues: {
      awards: (data?.awards as any) ?? [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const awards = value.awards?.filter((a) => a !== undefined);
      const hasChanged = !isEqual(awards, data.awards);
      if (!hasChanged) return;
      onChange({
        id: "awards",
        data: {
          awards: structuredClone(awards ?? []),
        },
      });
    });

    return () => subscription.unsubscribe();
  }, [form, data, onChange]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "awards",
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
                <AwardItem
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
                  title: "",
                  issuer: "",
                  date: "",
                  description: "",
                })
              }
            >
              Add award
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}

interface AwardItemProps {
  id: string;
  form: UseFormReturn<AwardValues>;
  index: number;
  remove: (index: number) => void;
}

function AwardItem({ id, form, index, remove }: AwardItemProps) {
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
        <span className="font-semibold">Award {index + 1}</span>
        <GripHorizontal
          className="size-5 cursor-grab text-muted-foreground focus:outline-none"
          {...attributes}
          {...listeners}
        />
      </div>
      <FormField
        control={form.control}
        name={`awards.${index}.title`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Title</FormLabel>
            <FormControl>
              <Input {...field} autoFocus placeholder="Employee of the Year" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`awards.${index}.issuer`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Issuing organization</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Acme Corp" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`awards.${index}.date`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Date</FormLabel>
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
        name={`awards.${index}.description`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                {...field}
                rows={3}
                placeholder="What was this award for?"
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

export default function AwardsForm() {
  const { stepper, updateSection } = useEditorContext();
  if (stepper.current?.id !== "awards") return null;
  const awardsStep = stepper.steps.find((step) => step.id === "awards");
  if (!awardsStep) return null;
  return (
    <_AwardsForm
      data={awardsStep.data ?? { awards: [] }}
      onChange={updateSection}
    />
  );
}
