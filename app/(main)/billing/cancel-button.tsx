"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cancelSubscriptionAction } from "./actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function CancelSubscriptionButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    const result = await cancelSubscriptionAction();
    setLoading(false);

    if (result.ok) {
      toast.success("Subscription cancelled", {
        description:
          "You'll keep Pro access until the end of your current billing period.",
        duration: 6000,
        position: "top-center",
      });
      router.refresh();
    } else {
      toast.error("Could not cancel subscription", {
        description: result.error,
        position: "top-center",
      });
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
          Cancel subscription
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel your Pro subscription?</AlertDialogTitle>
          <AlertDialogDescription>
            You&apos;ll keep Pro access until the end of your current billing
            period. After that, your account will revert to the Free plan and
            you&apos;ll lose access to Pro-only templates, AI Rewrite, and AI
            Tailor.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep my subscription</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={loading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Yes, cancel
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
