/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Alert from "@/features/dashboard/components/alert";
import RoomCard from "@/features/dashboard/components/room-card";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import EmptyCard from "@/features/dashboard/components/empty-card";
import { Room } from "@/features/dashboard/types";
import { useGetUserRooms } from "@/features/dashboard/api/use-get-user-rooms";
import { Loader } from "lucide-react";

const Page = () => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

  const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
  const [roomToLeave, setRoomToLeave] = useState<Room | null>(null);

  const [loading, setLoading] = useState(true);

  const { data: rooms, isLoading } = useGetUserRooms();

  const handleDeleteRoom = (room: Room) => {
    setRoomToDelete(room);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {};

  const handleLeaveRoom = (room: Room) => {
    setRoomToLeave(room);
    setLeaveDialogOpen(true);
  };

  const confirmLeave = async () => {};

  if (isLoading) {
    return (
      <div className="flex min-h-screen min-w-screen items-center justify-center">
        <Loader className="animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {rooms.length === 0 ? (
          <EmptyCard />
        ) : (
          <div className="space-y-4">
            {rooms.map((room: any) => (
              <RoomCard
                key={room._id}
                room={room}
              />
            ))}
          </div>
        )}
      </main>

      <Alert
        title={"Delete Room"}
        description={`Are you sure you want to delete ${roomToDelete?.name}? This action cannot be undone
                            and all room data will be permanently lost.`}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onClick={confirmDelete}
      />

      <Alert
        title={"Leave Room"}
        description={`Are you sure you want to leave ${roomToDelete?.name}? This action cannot be undone
                            and all room data will be permanently lost.`}
        open={leaveDialogOpen}
        onOpenChange={setLeaveDialogOpen}
        onClick={confirmLeave}
      />
    </div>
  );
};

export default Page;
