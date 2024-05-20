
'use client'

import { Bot } from "lucide-react";
import AIChatBox from "./AIChatBox";
import { Button } from "./ui/button";
import { useState } from "react";

export default function AIChatButton() {
    const [ chat_box_open, setChatBoxOpen] = useState<boolean>(false);

    return (
        <>
            <Button
                onClick={() => setChatBoxOpen(true)}
            >
                <Bot size={20} className='mr-2' />
                AI Chat
            </Button>
            <AIChatBox
                open={chat_box_open}
                onClose={ () => setChatBoxOpen(false) }
            />
        </>
    )
}