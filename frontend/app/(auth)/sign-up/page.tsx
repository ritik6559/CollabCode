'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { createUserSchema } from '@/features/auth/types';
import { useRegisterUser } from '@/features/auth/api/use-register-user';
import { getApiErrorMessage } from '@/lib/api';
import FormErrorBanner from '@/features/auth/components/form-error';

const signUpSchema = createUserSchema
    .extend({
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ['confirmPassword'],
    });

type SignUpFormValues = z.infer<typeof signUpSchema>;

const inputClasses =
    "h-11 border-stone-100/10 bg-stone-900/60 pl-10 text-stone-100 placeholder:text-stone-500 focus-visible:border-amber-400/50 focus-visible:ring-amber-400/20";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const router = useRouter();

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { mutateAsync: register, isPending, error, reset } = useRegisterUser();

    const onSubmit = async (values: SignUpFormValues) => {
        try {
            await register({
                username: values.username,
                email: values.email,
                password: values.password,
            });
            router.push('/home');
        } catch {
            // Handled below: the mutation's `error` renders in the banner,
            // and the hook has already shown a toast.
        }
    };

    return (
        <div className="lp-reveal space-y-8" style={{ animationDelay: '0.05s' }}>
            <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-stone-50">
                    Create your account
                </h2>
                <p className="text-stone-400">
                    Free forever. Your first room is ten seconds away.
                </p>
            </div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    onChange={() => error && reset()}
                    className="space-y-5"
                >
                    <FormErrorBanner
                        message={error ? getApiErrorMessage(error, 'Failed to create your account. Please try again.') : null}
                    />

                    <FormField
                        control={form.control}
                        name="username"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-300">Username</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                                        <Input
                                            type="text"
                                            autoComplete="username"
                                            placeholder="ada_lovelace"
                                            className={inputClasses}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-rose-300" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-300">Email</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                                        <Input
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            className={inputClasses}
                                            {...field}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-rose-300" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-300">Password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                                        <Input
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="At least 8 characters"
                                            className={`${inputClasses} pr-11`}
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition-colors hover:text-stone-300"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-rose-300" />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-stone-300">Confirm password</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
                                        <Input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            placeholder="Repeat your password"
                                            className={`${inputClasses} pr-11`}
                                            {...field}
                                        />
                                        <button
                                            type="button"
                                            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 transition-colors hover:text-stone-300"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </FormControl>
                                <FormMessage className="text-sm text-rose-300" />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="lp-shine group h-11 w-full bg-gradient-to-r from-amber-400 to-orange-500 text-base font-semibold text-stone-950 shadow-lg shadow-orange-500/25 hover:from-amber-300 hover:to-orange-400"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Creating account…
                            </>
                        ) : (
                            <>
                                Create account
                                <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </>
                        )}
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-stone-400">
                Already have an account?{' '}
                <Link
                    href="/sign-in"
                    className="font-medium text-amber-300 transition-colors hover:text-amber-200"
                >
                    Sign in
                </Link>
            </p>
        </div>
    );
};

export default SignUpPage;
