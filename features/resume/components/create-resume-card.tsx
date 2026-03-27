"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useModal } from "@/hooks/use-modal";
import { Plus } from "lucide-react";
import { FaArrowRight, FaFileCirclePlus } from "react-icons/fa6";
import { CreateResumeModal } from "./modals/create-resume-modal";

export const CreateResumeCard: React.FC<{ asButton?: boolean }> = ({
  asButton = false,
}) => {
  const modal = useModal();

  const handleClick = () => {
    modal.open();
  };

  return (
    <>
      {asButton ? (
        <Button onClick={handleClick} size="sm" className="gap-2">
          <Plus className="size-4" />
          Create Resume
        </Button>
      ) : (
        <Card
          className="group  dark:hover:shadow-accent hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={handleClick}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="rounded-md bg-primary/10 p-3 text-primary transition-all duration-200 group-hover:scale-110">
                <FaFileCirclePlus className="size-6" />
              </div>
              <Button
                variant="link"
                size="icon-sm"
                className="text-muted-foreground cursor-pointer group-hover:text-primary"
              >
                <FaArrowRight />
              </Button>
            </div>
            <CardTitle className="text-xl mt-4">Create New Resume</CardTitle>
            <CardDescription>
              Design a polished, professional resume using our easy-to-use
              builder.
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      <CreateResumeModal modal={modal} />
    </>
  );
};
