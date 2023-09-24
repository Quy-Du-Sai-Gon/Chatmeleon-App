'use client';

import { signOut } from "next-auth/react";

const Conversations = () => {
    return (
        <div>
            Conversations
            <button onClick={() => signOut()}>
                LOG OUT
            </button>
        </div>
    )
}

export default Conversations;