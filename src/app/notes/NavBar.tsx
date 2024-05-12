'use client'

import Link from "next/link";
import Image from 'next/image'
import logo from '../../../public/vercel.svg'
import { SignOutButton, UserButton } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import AddNoteDialog from "@/components/AddNoteDIalog";

export default function NavBar() {
    const [ showAddNote, setShowAddNote ] = useState<boolean>(false)

    return (
        <>
            <div
                className='p-4 shadow'
            >
                <div className="m-auto flex flex-row max-w-7xl flex-wrap items-center justify-between gap-3">
                    <Link href={'/notes'} className="flex items-center gap-1">
                        <Image src={logo} width={40} height={40} alt={'app logo'} />
                        <span className="font-bold">Notes.ai</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: { width: '2.5rem', height: '2.5rem' } } }} />
                        <Button
                            onClick={() => setShowAddNote(!showAddNote)}
                        >
                            <Plus />
                            Add Note
                        </Button>
                    </div>
                </div>
            </div>
            <AddNoteDialog 
                open={showAddNote}
                setOpen={setShowAddNote}
            />
        </>
    )
}