/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {useEffect, useState} from 'react';
import Alert from "@/features/dashboard/components/alert";
import RoomCard from "@/features/dashboard/components/room-card";
import DashboardHeader from "@/features/dashboard/components/dashboard-header";
import EmptyCard from "@/features/dashboard/components/empty-card";
import {Room} from "@/features/dashboard/types";


const  Page = () => {
    const [rooms, setRooms] = useState<Room[]>([]);

    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [leaveDialogOpen, setLeaveDialogOpen] = useState(false);

    const [roomToDelete, setRoomToDelete] = useState<Room | null>(null);
    const [roomToLeave, setRoomToLeave] = useState<Room | null>(null);

    const [loading, setLoading] = useState(true);


    const handleDeleteRoom = (room: Room) => {
        setRoomToDelete(room);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = async () => {
    };

    const handleLeaveRoom = (room: Room) => {
        setRoomToLeave(room);
        setLeaveDialogOpen(true);
    };

    const confirmLeave = async () => {
       
    };


    useEffect(() => {

        const fetchRooms = async () => {
            // const rooms = await getUserRooms(token!);
            // setRooms(rooms);
            // setLoading(false);
        }

        fetchRooms();

    }, []);

   

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
            <DashboardHeader />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {rooms.length === 0 ? (
                    <EmptyCard />
                ) : (
                    <div className="space-y-4">
                        {rooms.map((room) => (
                            <RoomCard key={room._id} room={room} onDeleteRoom={handleDeleteRoom} onLeaveRoom={handleLeaveRoom} />
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
}


export default Page;
