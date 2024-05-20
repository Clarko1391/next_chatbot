import Note from "@/components/Note"
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
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            { all_notes.map( note => <Note note={note} key={note.id} /> ) }
            { all_notes.length === 0 &&
                <p
                    className="col-span-full text-center"
                >{`You don't have any notes yet, create one to get started`}</p>
            }
        </div>
    )
};