import { notesIndex } from "@/lib/db/pinecone.";
import prisma from "@/lib/db/prisma";
import openai, { getEmbedding } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { ChatCompletionMessage, ChatCompletionSystemMessageParam } from "openai/resources/index.mjs";
import { OpenAIStream, StreamingTextResponse } from 'ai'

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const messages: ChatCompletionMessage[] = body.messages

        // truncate full chat history into last 6 messages, this is to allow vector embedding to
        // operate on a reasonable data set instead of trying to locate ambiguous indexes constantly
        const messagesTruncated = messages.slice(-6);

        const embedding = await getEmbedding(
            messagesTruncated.map((message) => message.content).join('\n')
        )

        const { userId } = auth();

        const vectorQueryResponse = await notesIndex.query({
            vector: embedding,
            topK: 4, // improves quality of response by working with more reesults but is computationally expensive
            filter: {userId}
        })

        const relevantNotes = await prisma.note.findMany({
            where: {
                id: {
                    in: vectorQueryResponse.matches.map((match) => match.id)
                }
            }
        })

        console.log("relevant notes found: ", relevantNotes)

        const systemMessage: ChatCompletionSystemMessageParam = {
            role: 'system',
            content:
            'You are an intelligent note-taking app. You answer the user\'s question based on their existing note. ' +
            "The relevant notes for this query are: \n" +
            relevantNotes.map((note) => `Title:${note.title}\n\nContent:\n${note.content}`).join('\n\n')
        }

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            stream: true,
            messages: [
                systemMessage,
                ...messagesTruncated
            ]
        })

        const stream = OpenAIStream(response)

        return new StreamingTextResponse(stream)
    }
    catch(error) {
        console.log(error)
        return Response.json({ error: 'Internal server error, please try again'}, { status: 500 })
    }
}