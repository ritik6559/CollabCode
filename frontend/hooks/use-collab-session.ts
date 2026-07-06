'use client';

import { useEffect, useState } from "react";
import * as Y from "yjs";
import {
    Awareness,
    applyAwarenessUpdate,
    encodeAwarenessUpdate,
    removeAwarenessStates,
} from "y-protocols/awareness";
import { Socket } from "socket.io-client";
import { ACTIONS } from "@/lib/utils";
import { CollabUser, toUint8 } from "@/lib/collab";

export interface CollabSession {
    doc: Y.Doc;
    awareness: Awareness;
}

const REMOTE_ORIGIN = "remote";

/**
 * Owns a Yjs document + awareness for one room and relays both over the
 * authenticated Socket.IO connection:
 *  - local document updates -> YJS_UPDATE -> peers (and vice versa)
 *  - cursor/name/color presence -> YJS_AWARENESS (and vice versa)
 *  - when a peer joins, pushes the full document state so they catch up
 */
export const useCollabSession = (
    socket: Socket,
    roomId: string,
    user: CollabUser | null
): CollabSession | null => {
    const [session, setSession] = useState<CollabSession | null>(null);

    // Create/destroy the doc per room. Effect-scoped so React StrictMode
    // remounts get a fresh, undestroyed document.
    useEffect(() => {
        const doc = new Y.Doc();
        const awareness = new Awareness(doc);
        setSession({ doc, awareness });

        return () => {
            removeAwarenessStates(awareness, [doc.clientID], "unmount");
            awareness.destroy();
            doc.destroy();
            setSession(null);
        };
    }, [roomId]);

    // Announce who we are (name + cursor color) to the room.
    useEffect(() => {
        if (session && user) {
            session.awareness.setLocalStateField("user", user);
        }
    }, [session, user]);

    // Socket relay wiring.
    useEffect(() => {
        if (!session) {
            return;
        }

        const { doc, awareness } = session;

        const handleLocalUpdate = (update: Uint8Array, origin: unknown) => {
            if (origin !== REMOTE_ORIGIN) {
                socket.emit(ACTIONS.YJS_UPDATE, { room: roomId, update });
            }
        };

        const handleRemoteUpdate = ({ update }: { update: ArrayBuffer }) => {
            Y.applyUpdate(doc, toUint8(update), REMOTE_ORIGIN);
        };

        const handleLocalAwareness = (
            { added, updated, removed }: { added: number[]; updated: number[]; removed: number[] },
            origin: unknown
        ) => {
            if (origin === REMOTE_ORIGIN) {
                return;
            }
            const changed = [...added, ...updated, ...removed];
            socket.emit(ACTIONS.YJS_AWARENESS, {
                room: roomId,
                update: encodeAwarenessUpdate(awareness, changed),
            });
        };

        const handleRemoteAwareness = ({ update }: { update: ArrayBuffer }) => {
            applyAwarenessUpdate(awareness, toUint8(update), REMOTE_ORIGIN);
        };

        // A peer (re)joined: send them the full document and our presence
        const handleUserJoined = () => {
            socket.emit(ACTIONS.YJS_UPDATE, {
                room: roomId,
                update: Y.encodeStateAsUpdate(doc),
            });
            socket.emit(ACTIONS.YJS_AWARENESS, {
                room: roomId,
                update: encodeAwarenessUpdate(awareness, [doc.clientID]),
            });
        };

        doc.on("update", handleLocalUpdate);
        awareness.on("update", handleLocalAwareness);
        socket.on(ACTIONS.YJS_UPDATE, handleRemoteUpdate);
        socket.on(ACTIONS.YJS_AWARENESS, handleRemoteAwareness);
        socket.on(ACTIONS.USER_JOINED, handleUserJoined);

        return () => {
            doc.off("update", handleLocalUpdate);
            awareness.off("update", handleLocalAwareness);
            socket.off(ACTIONS.YJS_UPDATE, handleRemoteUpdate);
            socket.off(ACTIONS.YJS_AWARENESS, handleRemoteAwareness);
            socket.off(ACTIONS.USER_JOINED, handleUserJoined);
        };
    }, [session, socket, roomId]);

    return session;
};
