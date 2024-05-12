import prisma from "@/lib/db/prisma"
import { auth } from "@clerk/nextjs/server"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Notes.ai | Notes'
}

export default async function NotesPage() {
    const { userId } = auth()

    if (!userId) throw Error('userId is undefined, please log in to continue')
    
    const all_notes = await prisma.note.findMany({where: {userId}})

    return (
        <div>
            {
                JSON.stringify(all_notes)
            }
        </div>
    )
};