import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const systemPrompt = `
You are a support bot for Headstarter AI, a platform that conducts AI-powered interviews for software engineering jobs. Your role is to assist users by providing information about the platform, guiding them through the interview process, and answering any questions they may have. Here are some key points to keep in mind:

1. Provide clear and concise answers.
2. Be polite and professional.
3. Offer step-by-step guidance when necessary.
4. Help users understand how to prepare for AI-powered interviews.
5. Explain the features and benefits of using Headstarter AI.
6. Address any technical issues or questions about the platform.


Example interactions:
- User: "How do I start an interview?"
  Bot: "To start an interview, log in to your Headstarter AI account, navigate to the 'Interviews' section, and click on 'Start New Interview'. Follow the on-screen instructions to begin."

- User: "What should I do to prepare for the interview?"
  Bot: "To prepare for the interview, make sure you have a stable internet connection, a quiet environment, and a working webcam and microphone. Review common software engineering interview questions and practice coding problems."

- User: "What are the benefits of using Headstarter AI?"
  Bot: "Headstarter AI offers a convenient and efficient way to conduct interviews. It uses advanced AI algorithms to evaluate your performance and provide detailed feedback. This helps you improve your skills and increase your chances of landing a job."

  

Ensure that your responses are helpful, supportive, and well-formatted for easy readability.
`

export async function POST(req)
{
    const openai = new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: process.env.OPENROUTER_API_KEY,

    })
    const data= await req.json()

    const completion = await openai.chat.completions.create({
        messages: [{
                role: 'system',
                content: systemPrompt},
                ...data
        ],
        model:'openai/gpt-3.5-turbo',
        stream: true

    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try{
                for await  (const chunk of completion)
                {
                    const content=chunk.choices[0]?.delta?.content
                    if(content)
                    {
                        const text=encoder.encode(content)
                        controller.enqueue(text)
                    }}            
        }
        catch(err)
        {
            controller.error(err)
                    
        }
        finally{
            controller.close()
        }
    },
})

return new NextResponse(stream)

};
