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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Code, Sparkles, Users } from 'lucide-react';

const languages = [
    { value: 'javascript', label: 'JavaScript', color: 'from-yellow-500/20 to-yellow-400/20 text-yellow-300 border-yellow-500/40' },
    { value: 'typescript', label: 'TypeScript', color: 'from-blue-500/20 to-blue-400/20 text-blue-300 border-blue-500/40' },
    { value: 'python', label: 'Python', color: 'from-green-500/20 to-green-400/20 text-green-300 border-green-500/40' },
    { value: 'java', label: 'Java', color: 'from-orange-500/20 to-orange-400/20 text-orange-300 border-orange-500/40' },
    { value: 'cpp', label: 'C++', color: 'from-purple-500/20 to-purple-400/20 text-purple-300 border-purple-500/40' },
    { value: 'react', label: 'React', color: 'from-cyan-500/20 to-cyan-400/20 text-cyan-300 border-cyan-500/40' },
    { value: 'nodejs', label: 'Node.js', color: 'from-emerald-500/20 to-emerald-400/20 text-emerald-300 border-emerald-500/40' },
    { value: 'go', label: 'Go', color: 'from-teal-500/20 to-teal-400/20 text-teal-300 border-teal-500/40' },
    { value: 'rust', label: 'Rust', color: 'from-red-500/20 to-red-400/20 text-red-300 border-red-500/40' },
    { value: 'php', label: 'PHP', color: 'from-indigo-500/20 to-indigo-400/20 text-indigo-300 border-indigo-500/40' },
];

const formSchema = z.object({
    name: z.string().min(1, 'Room name is required').max(50, 'Room name must be less than 50 characters'),
    description: z.string().max(200, 'Description must be less than 200 characters').optional(),
    language: z.string().min(1, 'Please select a programming language'),
});

type FormData = z.infer<typeof formSchema>;

interface CreateRoomFormProps {
    onCreateRoom: (roomData: FormData) => void;
}

export function CreateRoomForm({ onCreateRoom }: CreateRoomFormProps) {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            description: '',
            language: '',
        },
    });

    const selectedLanguage = languages.find(lang => lang.value === form.watch('language'));

    const onSubmit = async (data: FormData) => {
        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
            onCreateRoom(data);
            form.reset();
            setOpen(false);
        } catch (error) {
            console.error('Error creating room:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 cursor-pointer"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Room
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[500px] bg-gray-900/95 border border-gray-800/50 backdrop-blur-xl shadow-2xl">
                <DialogHeader className="space-y-4 pb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-3 rounded-xl bg-gray-800/50 border border-gray-700/30">
                            <Sparkles className="h-6 w-6 text-blue-300" />
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold text-white">
                                Create New Room
                            </DialogTitle>
                            <DialogDescription className="text-gray-400 mt-1">
                                Set up a collaborative coding space for your team
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Room Name Field */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200 font-medium flex items-center space-x-2">
                                        <Code className="h-4 w-4 text-gray-400" />
                                        <span>Room Name</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter room name..."
                                            {...field}
                                            className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200 h-12"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Choose a descriptive name for your coding room
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Language Selection */}
                        <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200 font-medium flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-gray-400" />
                                        <span>Programming Language</span>
                                    </FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="bg-gray-800/50 border-gray-700/50 text-white focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm h-12">
                                                <SelectValue placeholder="Select a programming language">
                                                    {selectedLanguage && (
                                                        <div className="flex items-center space-x-2">
                                                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${selectedLanguage.color.split(' ')[0]} ${selectedLanguage.color.split(' ')[1]}`} />
                                                            <span>{selectedLanguage.label}</span>
                                                        </div>
                                                    )}
                                                </SelectValue>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="bg-gray-900/95 border-gray-800/50 backdrop-blur-xl shadow-xl">
                                            {languages.map((language) => (
                                                <SelectItem
                                                    key={language.value}
                                                    value={language.value}
                                                    className="text-gray-200 hover:bg-gray-800/60 focus:bg-gray-800/60 cursor-pointer"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${language.color.split(' ')[0]} ${language.color.split(' ')[1]}`} />
                                                        <span>{language.label}</span>
                                                        <Badge
                                                            variant="outline"
                                                            className={`ml-auto ${language.color} text-xs backdrop-blur-sm`}
                                                        >
                                                            {language.label}
                                                        </Badge>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Select the primary language for this room
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-200 font-medium">
                                        Description <span className="text-gray-500 font-normal">(Optional)</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Describe what you'll be working on..."
                                            className="bg-gray-800/50 border-gray-700/50 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/20 backdrop-blur-sm transition-all duration-200 min-h-[100px] resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-gray-500 text-sm">
                                        Add details about your project or goals (max 200 characters)
                                    </FormDescription>
                                    <FormMessage className="text-red-400" />
                                </FormItem>
                            )}
                        />

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
                                disabled={isSubmitting}
                                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 min-w-[120px]"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <Plus className="h-4 w-4" />
                                        <span>Create Room</span>
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
