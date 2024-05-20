import { Pinecone } from '@pinecone-database/pinecone'

const apiKey = process.env.PINECONE_DB_API_KEY

if (!apiKey) {
    throw Error('Pinecone API key not set in root of project')
}

const pinecone = new Pinecone({
    apiKey,
})

export const notesIndex = pinecone.Index('next-chatbot-note-app');