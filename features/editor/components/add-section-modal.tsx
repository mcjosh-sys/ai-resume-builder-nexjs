"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/hooks/use-modal";
import { useMemo, useState } from "react";

import { Step } from "../contexts/editor-context";
import { ICON_OPTIONS } from "../resource/icons";

type AddSectionModalProps = {
  modal: Modal;
  onSubmit: (payload: {
    title: string;
    sidebarDesc?: string;
    desc?: string;
    icon?: Step["icon"];
  }) => void;
};

export const AddSectionModal: React.FC<AddSectionModalProps> = ({
  modal,
  onSubmit,
}) => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIconId, setSelectedIconId] = useState(ICON_OPTIONS[0].id);

  const selectedIcon = useMemo(
    () => ICON_OPTIONS.find((item) => item.id === selectedIconId),
    [selectedIconId],
  );

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      modal.close();
      setTitle("");
      setShortDescription("");
      setDescription("");
      setSelectedIconId(ICON_OPTIONS[0].id);
    }
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      return;
    }

    onSubmit({
      title: trimmedTitle,
      sidebarDesc: shortDescription.trim() || undefined,
      desc: description.trim() || undefined,
      icon: selectedIcon
        ? {
            id: selectedIcon.id,
            component: selectedIcon.icon,
          }
        : undefined,
    });

    handleOpenChange(false);
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Section</DialogTitle>
          <DialogDescription>
            Create a custom section and choose how it appears in the editor.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="section-title">Section title</Label>
            <Input
              id="section-title"
              placeholder="Publications"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-sidebar-desc">Sidebar description</Label>
            <Input
              id="section-sidebar-desc"
              placeholder="Books, journals"
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="section-desc">Editor description</Label>
            <Input
              id="section-desc"
              placeholder="Add publications relevant to your role"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Icon</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {ICON_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = option.id === selectedIconId;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedIconId(option.id)}
                    className={[
                      "flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary"
                        : "hover:border-muted-foreground/50",
                    ].join(" ")}
                  >
                    <Icon className="size-4" />
                    <span className="truncate">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={!title.trim()}>
            Add Section
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
