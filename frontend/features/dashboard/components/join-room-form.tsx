"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Hash, Loader2, LogIn } from "lucide-react";
import { JoinRoomInput, joinRoomSchema } from "../types";
import { useJoinRoom } from "../api/use-join-room";
import { User } from "@/features/auth/types";
import { getApiErrorMessage } from "@/lib/api";
import FormErrorBanner from "@/components/form-error";

interface JoinRoomFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user: User;
}

const JoinRoomForm = ({ open, onOpenChange, user }: JoinRoomFormProps) => {
    const router = useRouter();

    const form = useForm<JoinRoomInput>({
        resolver: zodResolver(joinRoomSchema),
        defaultValues: {
            roomId: "",
        },
    });

    const { mutateAsync: joinRoom, isPending, error, reset } = useJoinRoom();

    const handleOpenChange = (next: boolean) => {
        if (!next) {
            form.reset();
            reset();
        }
        onOpenChange(next);
    };

    const onSubmit = async (data: JoinRoomInput) => {
        try {
            const room = await joinRoom(data.roomId.trim());
            handleOpenChange(false);
            const base = room.type === "doc" ? "/doc" : "/editor";
            router.push(`${base}/${room._id}?username=${encodeURIComponent(user.username)}`);
        } catch {
            // Error surfaces in the banner below and as a toast from the hook.
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="border-stone-100/10 bg-stone-950/95 backdrop-blur-xl sm:max-w-[440px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-rose-500/25">
                            <LogIn className="h-5 w-5 text-stone-950" />
                        </span>
                        <div>
                            <DialogTitle className="text-xl font-bold text-stone-50">
                                Join a room
                            </DialogTitle>
                            <DialogDescription className="text-stone-400">
                                Paste the room ID a teammate shared with you
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-2">
                        <FormErrorBanner
                            message={error ? getApiErrorMessage(error, "Failed to join room. Please try again.") : null}
                        />

                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-stone-300">Room ID</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                                            <Input
                                                placeholder="e.g. 665f1c2ab34d9c0012a4e7f9"
                                                className="h-11 border-stone-100/10 bg-stone-900/60 pl-10 font-mono text-stone-100 placeholder:text-stone-600 focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20"
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-sm text-rose-300" />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => handleOpenChange(false)}
                                className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isPending}
                                className="bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400"
                            >
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Joining…
                                    </>
                                ) : (
                                    <>
                                        <LogIn className="mr-1 h-4 w-4" />
                                        Join room
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default JoinRoomForm;
