import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { languageSchema, LanguageValues } from "@/lib/validation";
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
import { GripHorizontal, X } from "lucide-react";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { useEditorContext } from "../../contexts/editor-context";
import { FormCompProps } from "../../types/editor-resume.type";

const LANGUAGE_LEVELS = [
  "BEGINNER",
  "INTERMEDIATE",
  "ADVANCED",
  "FLUENT",
  "NATIVE",
] as const;

const LEVEL_LABELS: Record<string, string> = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  FLUENT: "Fluent",
  NATIVE: "Native",
};

const LEVEL_COLORS: Record<string, string> = {
  BEGINNER: "bg-slate-100 text-slate-600 border-slate-200",
  INTERMEDIATE: "bg-blue-50 text-blue-600 border-blue-200",
  ADVANCED: "bg-indigo-50 text-indigo-600 border-indigo-200",
  FLUENT: "bg-violet-50 text-violet-600 border-violet-200",
  NATIVE: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const LEVEL_ACTIVE_COLORS: Record<string, string> = {
  BEGINNER: "bg-slate-500 text-white border-slate-500",
  INTERMEDIATE: "bg-blue-500 text-white border-blue-500",
  ADVANCED: "bg-indigo-500 text-white border-indigo-500",
  FLUENT: "bg-violet-500 text-white border-violet-500",
  NATIVE: "bg-emerald-500 text-white border-emerald-500",
};

function LevelPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  const current = value ?? "INTERMEDIATE";
  return (
    <div className="flex flex-wrap items-center gap-1">
      {LANGUAGE_LEVELS.map((level) => {
        const isActive = current === level;
        return (
          <button
            key={level}
            type="button"
            onClick={() => onChange(level)}
            className={cn(
              "rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors",
              isActive ? LEVEL_ACTIVE_COLORS[level] : LEVEL_COLORS[level],
            )}
          >
            {LEVEL_LABELS[level]}
          </button>
        );
      })}
    </div>
  );
}

function LevelSelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select proficiency" />
      </SelectTrigger>
      <SelectContent>
        {LANGUAGE_LEVELS.map((level) => (
          <SelectItem key={level} value={level} className="capitalize">
            {LEVEL_LABELS[level]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function _LanguagesForm({ data, onChange }: FormCompProps<"languages">) {
  const form = useForm<LanguageValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      languages: (data?.languages as any) ?? [],
    },
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      const languages = value.languages?.filter((l) => l !== undefined);
      const hasChanged = !isEqual(languages, data.languages);
      if (!hasChanged) return;
      onChange({
        id: "languages",
        data: { languages: structuredClone(languages ?? []) as any },
      });
    });
    return () => subscription.unsubscribe();
  }, [form, data, onChange]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "languages",
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
              <LanguageRow
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
            Add language
          </Button>
        </div>
      </form>
    </Form>
  );
}

function LanguageRow({
  id,
  index,
  form,
  remove,
}: {
  id: string;
  index: number;
  form: UseFormReturn<LanguageValues>;
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
        "space-y-1.5 rounded-lg border p-3",
        isDragging && "relative z-50 opacity-80",
      )}
    >
      <div className="flex items-center gap-2">
        <GripHorizontal
          className="size-4 shrink-0 cursor-grab text-muted-foreground"
          {...attributes}
          {...listeners}
        />
        <div className="flex flex-col flex-1 gap-2">
          <FormField
            control={form.control}
            name={`languages.${index}.name`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input {...field} placeholder="e.g. Spanish" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={`languages.${index}.level`}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <LevelSelect
                    value={field.value ?? "INTERMEDIATE"}
                    onChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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
    </div>
  );
}

export default function LanguagesForm() {
  const { stepper, updateSection } = useEditorContext();
  if (stepper.current?.id !== "languages") return null;
  const step = stepper.steps.find((s) => s.id === "languages");
  if (!step) return null;
  return (
    <_LanguagesForm
      data={step.data ?? { languages: [] }}
      onChange={updateSection}
    />
  );
}
