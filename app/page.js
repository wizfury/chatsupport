'use client'
import Image from "next/image";
import { useState,useRef,useEffect } from "react"
import {Box,Stack, TextField,Button,Typography, ThemeProvider, createTheme} from "@mui/material"
import TypingEffect from './TypingEffect'; 


const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9', // light blue
    },
    secondary: {
      main: '#f48fb1', // pink
    },
    background: {
      default: '#121212', // dark background
      paper: '#1e1e1e', // slightly lighter dark background
    },
    text: {
      primary: '#ffffff', // white text
    },
  },
});



export default function Home() {

  const [messages,setMessages]=useState([
    {
    role: 'assistant',
    content: "Hii i'm Headstarter Support Agent, how can I assist you today?"
  },

 
])

  const [message,setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);

  setMessage('')  
  setMessages((messages) => [
    ...messages,
    { role: 'user', content: message },  
    { role: 'assistant', content: '' }, 
  ])




  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([...messages, { role: 'user', content: message }]),
    })

    if (!response.ok) {
      throw new Error('Network response was not ok')
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      const text = decoder.decode(value, { stream: true })
      setMessages((messages) => {
        let lastMessage = messages[messages.length - 1]
        let otherMessages = messages.slice(0, messages.length - 1)
        return [
          ...otherMessages,
          { ...lastMessage, content: lastMessage.content + text },
        ]
      })
    }
  } catch (error) {
    console.error('Error:', error)
    setMessages((messages) => [
      ...messages,
      { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
    ])
  }
  setIsLoading(false)
}

const handleKeyPress = (event)=> {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
}}

const messagesEndRef = useRef(null)

const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
}

useEffect(() => {
  scrollToBottom()
}, [messages])


  return (

  <ThemeProvider theme={darkTheme}>
  <Box 
  width="100vw" 
  height="100vh" 
  display={"flex"} 
  flexDirection={'column'} 
  justifyContent={"center"} 
  alignItems={"center"}
  bgcolor={'background.default'}
  color={"text.primary"}
  p={2}
  overflow="hidden"
  >
     <Typography variant="h3" alignItems={"center"} gutterBottom color="primary">
          Welcome to Headstarter AI Support
        </Typography>

    <Box display="flex" p={2} alignItems="center">
          <TypingEffect
            text="Headstarter AI, is a platform that conducts AI-powered interviews for software engineering jobs."
            speed={75} color={'secondary'}
          />
        </Box>
      
      

    <Stack
    direction={"column"}
    width={"500px"}
    height={"700px"}
    border={"1px solid #333"}
    p={2}
    spacing={3}
    bgcolor={"Background.paper"}
    borderRadius={2}
    >
      <Stack 
      direction={"column"} 
      spacing={2}
      flexGrow={1}
      overflow="auto"
      maxHeight={"100%"}>
        {
          messages.map((message, index)=>(
            <Box
            key={index}
            display={"flex"}
            justifyContent={
              message.role==='assistant'? 'flex-start':'flex-end'
            }>

              <Box
              
              bgcolor={
                message.role==='assistant'? 'primary.main':'secondary.main'
              }
              color={"white"}
              borderRadius={4}

              p={3}>
                {message.content}

              </Box>

            </Box>
          ))}
          <div ref = {messagesEndRef}></div>
        </Stack>
        <Stack
        direction={'row'} spacing={2}>
          <TextField
          label="messages"
          fullWidth
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
          
          >

          </TextField>
          <Button variant="contained" onClick={sendMessage} disabled={isLoading}>{isLoading? 'sending':'Send'}</Button>

        </Stack>
    </Stack>

  </Box>
  </ThemeProvider>
  
)
  
}
