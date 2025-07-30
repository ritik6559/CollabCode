"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Users, Hash, LogIn } from 'lucide-react';
import {useRouter} from "next/navigation";

const formSchema = z.object({
    roomId: z.string().min(1, 'Room ID is required').min(6, 'Room ID must be at least 6 characters'),
});

type FormData = z.infer<typeof formSchema>;

interface JoinRoomFormProps {
    onJoinRoom: (roomId: string) => void;
}

const JoinRoomForm = ({ onJoinRoom }: JoinRoomFormProps) => {
    const [open, setOpen] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            roomId: '',
        },
    });
    const router = useRouter();



    const onSubmit = async (data: FormData) => {
        // setIsJoining(true);
        // try {
        //     router.push(`/editor/${data.roomId}?username=${user!.username}`);
        //     form.reset();
        //     setOpen(false);
        // } catch (error) {
        //     console.error('Error joining room:', error);
        // } finally {
        //     setIsJoining(false);
        // }
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-700/50 bg-gray-800/30 text-gray-300 hover:bg-gray-700/40 hover:text-white hover:border-gray-600/50 transition-all duration-200 backdrop-blur-sm cursor-pointer"

                >
                    <Users className="h-4 w-4 mr-2" />
                    Join Room
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[450px] bg-gray-900/95 border border-gray-800/50 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="space-y-4 pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/30">
                            <LogIn className="h-6 w-6 text-green-300" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white">
                                Join Room
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 mt-1">
                                Enter the room ID to join an existing coding session
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Room ID Field */}
                        <FormField
                            control={form.control}
                            name="roomId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200 font-medium flex items-center space-x-2">
                                        <Hash className="h-4 w-4 text-gray-400" />
                                        <span>Room ID</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter room ID (e.g., ABC123)"
                                            {...field}
                                            className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-green-500/50 focus:ring-green-500/20 backdrop-blur-sm transition-all duration-200 h-12 font-mono text-lg tracking-wider"
                                            onChange={(e) => field.onChange(e.target.value)}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Ask the room creator for the room ID to join their session
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        <div className="bg-gray-800/30 border border-gray-700/30 rounded-lg p-4">
                            <div className="flex items-start space-x-3">
                                <div className="p-2 rounded-lg bg-blue-500/20 border border-blue-500/30">
                                    <Users className="h-4 w-4 text-blue-300" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-200 mb-1">
                                        Joining a Room
                                    </h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">
                                        Once you join, you&apos;ll be able to collaborate in real-time with other participants in the coding session.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="pt-6 border-t border-gray-800/30">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-700/50 hover:text-white hover:border-gray-600/50 transition-all duration-200 backdrop-blur-sm"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={isJoining}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-200 min-w-[120px]"
                            >
                                {isJoining ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Joining...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <LogIn className="h-4 w-4" />
                                        <span>Join Room</span>
                                    </div>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

export default JoinRoomForm;
