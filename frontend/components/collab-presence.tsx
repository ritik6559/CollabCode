'use client';

import React, { useEffect, useState } from "react";
import { Awareness } from "y-protocols/awareness";
import { CollabUser } from "@/lib/collab";

interface PresenceEntry extends CollabUser {
    clientId: number;
    isSelf: boolean;
}

interface CollabPresenceProps {
    awareness: Awareness;
}

/** Live list of everyone in the room, dot-colored to match their cursor. */
const CollabPresence = ({ awareness }: CollabPresenceProps) => {
    const [users, setUsers] = useState<PresenceEntry[]>([]);

    useEffect(() => {
        const refresh = () => {
            const entries: PresenceEntry[] = [];
            awareness.getStates().forEach((state, clientId) => {
                const user = state.user as CollabUser | undefined;
                if (user?.name) {
                    entries.push({
                        clientId,
                        name: user.name,
                        color: user.color,
                        isSelf: clientId === awareness.clientID,
                    });
                }
            });
            entries.sort((a, b) => Number(b.isSelf) - Number(a.isSelf));
            setUsers(entries);
        };

        refresh();
        awareness.on("change", refresh);

        return () => {
            awareness.off("change", refresh);
        };
    }, [awareness]);

    if (users.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-1.5">
            {users.map((user) => (
                <span
                    key={user.clientId}
                    title={user.isSelf ? `${user.name} (you)` : user.name}
                    className="flex items-center gap-1.5 rounded-full border border-stone-100/10 bg-stone-900/60 px-2.5 py-1 text-xs text-stone-200"
                >
                    <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: user.color }}
                    />
                    <span className="max-w-[90px] truncate">
                        {user.isSelf ? `${user.name} (you)` : user.name}
                    </span>
                </span>
            ))}
        </div>
    );
};

export default CollabPresence;
