import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { skillSchema, SkillValues } from "@/lib/validation";
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
import { GripHorizontal, Star, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useEditorContext } from "../../contexts/editor-context";
import { FormCompProps } from "../../types/editor-resume.type";

const LEVEL_MAP: Record<number, string> = {
  1: "BEGINNER",
  2: "INTERMEDIATE",
  3: "ADVANCED",
  4: "EXPERT",
};
const VALUE_MAP: Record<string, number> = {
  BEGINNER: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4,
};

function StarRating({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const current = VALUE_MAP[value ?? "INTERMEDIATE"] ?? 2;
  const [hovered, setHovered] = useState<number | null>(null);
  const display = hovered ?? current;

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(LEVEL_MAP[star])}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(null)}
          className="focus:outline-none"
          aria-label={LEVEL_MAP[star]}
        >
          <Star
            className={cn(
              "size-4 transition-colors",
              star <= display
                ? "fill-amber-400 text-amber-400"
                : "text-muted-foreground/30",
            )}
          />
        </button>
      ))}
    </div>
  );
}

function _SkillsForm({ data, onChange }: FormCompProps<"skills">) {
  const form = useForm<SkillValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      skills: (data?.skills as any) ?? [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const skills = value.skills?.filter((s) => s !== undefined);
      const hasChanged = !isEqual(skills, data.skills);
      if (!hasChanged) return;
      onChange({
        id: "skills",
        data: { skills: structuredClone(skills ?? []) as any },
      });
    });
    return () => subscription.unsubscribe();
  }, [form, data, onChange]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "skills",
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
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      move(oldIndex, newIndex);
      return arrayMove(fields, oldIndex, newIndex);
    }
  }

  return (
    <Form {...form}>
      <form className="space-y-2">
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
              <SkillRow
                key={field.id}
                id={field.id}
                index={index}
                form={form}
                remove={remove}
              />
            ))}
          </SortableContext>
        </DndContext>
        <div className="flex justify-center pt-1">
          <Button
            type="button"
            onClick={() => append({ name: "", level: "INTERMEDIATE" })}
          >
            Add skill
          </Button>
        </div>
      </form>
    </Form>
  );
}

function SkillRow({
  id,
  index,
  form,
  remove,
}: {
  id: string;
  index: number;
  form: UseFormReturn<SkillValues>;
  remove: (i: number) => void;
}) {
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
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "flex items-center gap-2",
        isDragging && "relative z-50 opacity-80",
      )}
    >
      <GripHorizontal
        className="size-4 shrink-0 cursor-grab text-muted-foreground"
        {...attributes}
        {...listeners}
      />
      <FormField
        control={form.control}
        name={`skills.${index}.name`}
        render={({ field }) => (
          <FormItem className="flex-1">
            <FormControl>
              <Input {...field} placeholder="e.g. TypeScript" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`skills.${index}.level`}
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <StarRating
                value={field.value ?? "INTERMEDIATE"}
                onChange={field.onChange}
              />
            </FormControl>
          </FormItem>
        )}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() => remove(index)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}

export default function SkillsForm() {
  const { stepper, updateSection } = useEditorContext();
  if (stepper.current?.id !== "skills") return null;
  const step = stepper.steps.find((s) => s.id === "skills");
  if (!step) return null;
  return (
    <_SkillsForm data={step.data ?? { skills: [] }} onChange={updateSection} />
  );
}
