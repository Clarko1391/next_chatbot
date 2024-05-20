import OpenAI from 'openai'

const apiKey = process.env.OPEN_AI_API_KEY

if (!apiKey) {
    throw Error('No Open AI api key set in project root')
}

const openai = new OpenAI({ apiKey });

export default openai;



export async function getEmbedding(text: string) {
    const response = await openai.embeddings.create({
        model: 'text-embedding-ada-002',
        input: text
    })

    const embedding = response.data[0].embedding

    if (!embedding) throw Error('Error generating embedding @openai api')

    console.log(embedding);

    return embedding;
}