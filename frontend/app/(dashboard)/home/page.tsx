"use client";

import { useMemo, useRef, useState } from "react";
import { AlertCircle, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Alert from "@/features/dashboard/components/alert";
import RoomCard from "@/features/dashboard/components/room-card";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import EmptyCard from "@/features/dashboard/components/empty-card";
import StartNewSection from "@/features/dashboard/components/start-new-section";
import CreateRoomForm from "@/features/dashboard/components/create-room-form";
import JoinRoomForm from "@/features/dashboard/components/join-room-form";
import { Room, RoomType } from "@/features/dashboard/types";
import { useGetUserRooms } from "@/features/dashboard/api/use-get-user-rooms";
import { useGetCurrentUser } from "@/features/auth/api/use-get-current-user";
import { useCreateRoom } from "@/features/dashboard/api/use-create-room";
import { useDeleteRoom } from "@/features/dashboard/api/use-delete-room";
import { useLeaveRoom } from "@/features/dashboard/api/use-leave-room";
import { getApiErrorMessage } from "@/lib/api";
import { DEFAULT_LANGUAGE_ID, LANGUAGE_BY_EXTENSION } from "@/data";

const MAX_UPLOAD_BYTES = 256 * 1024;

type OwnerFilter = "all" | "mine" | "shared";

const filterTabs: { value: OwnerFilter; label: string }[] = [
    { value: "all", label: "All rooms" },
    { value: "mine", label: "Owned by me" },
    { value: "shared", label: "Shared with me" },
];

const Page = () => {
    const [search, setSearch] = useState("");
    const [ownerFilter, setOwnerFilter] = useState<OwnerFilter>("all");

    const [createType, setCreateType] = useState<RoomType | null>(null);
    const [joinOpen, setJoinOpen] = useState(false);

    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [roomToLeave, setRoomToLeave] = useState<Room | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const { data: user } = useGetCurrentUser();
    const { data: rooms, isLoading, error, refetch, isRefetching } = useGetUserRooms();

    const { mutateAsync: createRoom } = useCreateRoom();
    const { mutateAsync: deleteRoom } = useDeleteRoom();
    const { mutateAsync: leaveRoom } = useLeaveRoom();

    const filteredRooms = useMemo(() => {
        if (!rooms || !user) return [];

        return rooms
            .filter((room) => {
                if (ownerFilter === "mine") return room.admin._id === user._id;
                if (ownerFilter === "shared") return room.admin._id !== user._id;
                return true;
            })
            .filter((room) =>
                room.name.toLowerCase().includes(search.trim().toLowerCase())
            );
    }, [rooms, user, ownerFilter, search]);

    const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ""; // allow picking the same file again

        if (!file) return;

        if (file.size > MAX_UPLOAD_BYTES) {
            toast.error("File is too large — the limit is 256 KB.");
            return;
        }

        setIsUploading(true);
        try {
            const code = await file.text();
            const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
            const language = LANGUAGE_BY_EXTENSION[extension] ?? DEFAULT_LANGUAGE_ID;

            await createRoom({
                name: file.name,
                description: "Uploaded from device",
                type: "code",
                language,
                code,
            });
        } catch {
            // Hooks already toast the specific API error.
        } finally {
            setIsUploading(false);
        }
    };

    const confirmDelete = async () => {
        if (!roomToDelete) return;
        try {
            await deleteRoom(roomToDelete._id);
        } finally {
            setRoomToDelete(null);
        }
    };

    const confirmLeave = async () => {
        if (!roomToLeave) return;
        try {
            await leaveRoom(roomToLeave._id);
        } finally {
            setRoomToLeave(null);
        }
    };

    if (!user) return null; // layout guarantees a user; satisfies TS

    return (
        <div className="lp-root relative min-h-screen overflow-x-clip">
            <div className="lp-grid" />

            <div className="relative z-10">
                <DashboardHeader user={user} search={search} onSearchChange={setSearch} />

                <main className="mx-auto max-w-7xl space-y-10 px-4 py-8 sm:px-6 lg:px-8">
                    <StartNewSection
                        onNewCodeRoom={() => setCreateType("code")}
                        onNewDocRoom={() => setCreateType("doc")}
                        onUploadFile={() => fileInputRef.current?.click()}
                        onJoinRoom={() => setJoinOpen(true)}
                    />

                    <section className="space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <h2 className="text-sm font-medium uppercase tracking-wider text-stone-400">
                                Your rooms
                            </h2>
                            <div className="flex gap-1 rounded-full border border-stone-100/10 bg-stone-900/50 p-1">
                                {filterTabs.map((tab) => (
                                    <button
                                        key={tab.value}
                                        onClick={() => setOwnerFilter(tab.value)}
                                        className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                                            ownerFilter === tab.value
                                                ? "bg-gradient-to-r from-amber-400 to-orange-500 text-stone-950"
                                                : "text-stone-400 hover:text-stone-200"
                                        }`}
                                    >
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {isLoading ? (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                                <span className="grid h-14 w-14 place-items-center rounded-full border border-rose-400/30 bg-rose-500/10">
                                    <AlertCircle className="h-7 w-7 text-rose-300" />
                                </span>
                                <div>
                                    <h3 className="font-semibold text-stone-200">Couldn&#39;t load your rooms</h3>
                                    <p className="mt-1 text-sm text-stone-500">
                                        {getApiErrorMessage(error, "Something went wrong while fetching your rooms.")}
                                    </p>
                                </div>
                                <Button
                                    onClick={() => refetch()}
                                    disabled={isRefetching}
                                    variant="outline"
                                    className="border-stone-100/15 bg-stone-100/5 text-stone-200 hover:bg-stone-100/10 hover:text-white"
                                >
                                    {isRefetching ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <RefreshCw className="mr-2 h-4 w-4" />
                                    )}
                                    Try again
                                </Button>
                            </div>
                        ) : filteredRooms.length === 0 ? (
                            rooms && rooms.length > 0 ? (
                                <EmptyCard variant="no-results" searchTerm={search} />
                            ) : (
                                <EmptyCard onCreate={() => setCreateType("code")} />
                            )
                        ) : (
                            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {filteredRooms.map((room) => (
                                    <RoomCard
                                        key={room._id}
                                        room={room}
                                        user={user}
                                        onDelete={setRoomToDelete}
                                        onLeave={setRoomToLeave}
                                    />
                                ))}
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* Hidden input powering "Upload a file" */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".py,.c,.h,.cpp,.cc,.cxx,.hpp,.java,.cs,.nim,.c3,.bsq,.js,.ts,.txt,.md"
                className="hidden"
                onChange={handleFileSelected}
            />

            {isUploading && (
                <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-xl border border-stone-100/10 bg-stone-900/95 px-4 py-3 shadow-2xl backdrop-blur">
                    <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
                    <span className="text-sm text-stone-200">Uploading file…</span>
                </div>
            )}

            <CreateRoomForm
                key={createType ?? "closed"}
                open={createType !== null}
                onOpenChange={(open) => !open && setCreateType(null)}
                roomType={createType ?? "code"}
            />
            <JoinRoomForm open={joinOpen} onOpenChange={setJoinOpen} user={user} />

            <Alert
                title="Delete room"
                actionLabel="Delete"
                description={`Are you sure you want to delete "${roomToDelete?.name}"? This action cannot be undone and all room data will be permanently lost.`}
                open={!!roomToDelete}
                onOpenChange={(open) => !open && setRoomToDelete(null)}
                onClick={confirmDelete}
            />

            <Alert
                title="Leave room"
                actionLabel="Leave"
                description={`Are you sure you want to leave "${roomToLeave?.name}"? You'll need the room ID to join again.`}
                open={!!roomToLeave}
                onOpenChange={(open) => !open && setRoomToLeave(null)}
                onClick={confirmLeave}
            />
        </div>
    );
};

export default Page;
