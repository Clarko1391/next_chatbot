import { notesIndex } from "@/lib/db/pinecone.";
import prisma from "@/lib/db/prisma";
import { getEmbedding } from "@/lib/openai";
import { createNoteSchema, deleteNoteSchema, updateNoteSchema } from "@/lib/validation/note";
import { auth } from "@clerk/nextjs/server";


export async function POST(req: Request) {
    try {
        const body = await req.json();

        const parseResult = createNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error)
            return Response.json(
                { error: 'Invalid input' }, { status: 400 }
            )
        }

        const { title, content } = parseResult.data
        const { userId } = auth();

        if (!userId) {
            console.error(parseResult.error)
            return Response.json({
                error: 'Not Authorized, please log in or create an account'
            }, {
                status: 401
            }
            )
        }

        const embedding = await getEmbeddingForNote(title, content);

        const note = await prisma.$transaction(async (tx) => {
            const note = await tx.note.create({
                data: {
                    title,
                    content,
                    userId
                }
            });

            // NOTE: prisma cannot transact Pinecone, however, by sequencing the Pinecone op 2nd we can emulate it
            await notesIndex.upsert([
                {
                    id: note.id,
                    values: embedding,
                    metadata: { userId }
                }
            ])

            return note;
        })

        

        return Response.json(note, { status: 201 })

    }
    catch (error) {
        console.error(error)
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 }
        )
    }
}


export async function PUT(req: Request) {

    try{
        const body = await req.json();

        const parseResult = updateNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error)
            return Response.json(
                { error: 'Invalid input' }, { status: 400 }
            )
        }

        const { id, title, content } = parseResult.data

        const existing_note = await prisma.note.findUnique({where: {id}})

        if (!existing_note) {
            return Response.json({
                error: `Unable to retrieve note with id ${id}, please try again`
            }, { status: 404 }
            )
        }

        const { userId } = auth();

        if (!userId || userId !== existing_note.userId) {
            console.error(parseResult.error)
            return Response.json({
                error: 'Not Authorized'
            }, { status: 401 }
            )
        }

        const updated_note = await prisma.note.update({
            where: {id},
            data: {
                title,
                content
            }
        })

        return Response.json({updated_note}, { status: 200 })

    }
    catch (error) {
        console.error(error)
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 }
        )
    }
}


export async function DELETE(req: Request) {

    try{
        const body = await req.json();

        const parseResult = deleteNoteSchema.safeParse(body);

        if (!parseResult.success) {
            console.error(parseResult.error)
            return Response.json(
                { error: 'Invalid input' }, { status: 400 }
            )
        }

        const { id } = parseResult.data

        const existing_note = await prisma.note.findUnique({where: {id}})

        if (!existing_note) {
            return Response.json({
                error: `Unable to retrieve note with id ${id}, please try again`
            }, { status: 404 }
            )
        }

        const { userId } = auth();

        if (!userId || userId !== existing_note.userId) {
            console.error(parseResult.error)
            return Response.json({
                error: 'Not Authorized'
            }, { status: 401 }
            )
        }

        await prisma.note.delete({ where: {id} })

        return Response.json({ message: 'Note Deleted' }, { status: 200 })

    }
    catch (error) {
        console.error(error)
        return Response.json({
            error: 'Internal server error'
        }, { status: 500 }
        )
    }
}

async function getEmbeddingForNote(title: string, content?: string) {
    return getEmbedding(title + "\n\n" + content ?? "")
}