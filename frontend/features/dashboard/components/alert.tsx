import React from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface Props {
    title: string;
    description: string;
    actionLabel?: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClick: () => void;
}

const Alert = ({
    title,
    description,
    actionLabel,
    open,
    onOpenChange,
    onClick
}: Props) => {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="border-stone-100/10 bg-stone-950/95 backdrop-blur-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="font-bold text-stone-50">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-stone-400">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white">
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onClick}
                        className="bg-rose-600 text-white hover:bg-rose-500"
                    >
                        {actionLabel ?? title}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default Alert;
