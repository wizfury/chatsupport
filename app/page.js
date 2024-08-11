'use client'
import { useState,useRef,useEffect } from "react"
import {Box,Stack, TextField,Button,Typography, ThemeProvider, createTheme, IconButton} from "@mui/material"
import TypingEffect from './TypingEffect'; 
import StarIcon from '@mui/icons-material/Star';
import { signInWithGoogle, logOut } from "./authentication"; // adjust the path if necessary
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase"; 


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

  const [user, setUser] = useState(null);
const [authLoading, setAuthLoading] = useState(false);

 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setAuthLoading(false); 
    });

    return () => unsubscribe(); 
  }, []);

  const handleLogin = async () => {
    setAuthLoading(true); 
    const user = await signInWithGoogle();
    if (!user) {
      setAuthLoading(false); 
    }
  };

  const handleLogout = async () => {
    setAuthLoading(true); 
    await logOut();
    setAuthLoading(false); 
  };


  const [messages,setMessages]=useState([
    {
    role: 'assistant',
    content: "Hii i'm Headstarter Support Agent, how can I assist you today?"
  },

 
])

  const [message,setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedback, setFeedback] = useState(0)
  const [feedbackMessage, setFeedbackMessage] = useState(''); 
  const [showFeedbackInput, setShowFeedbackInput] = useState(false); 
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);

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

//added feature
const handleRatingSubmit = (rating) => {
  setFeedback(rating);
  setShowFeedbackInput(true); 
};

const handleFeedbackSubmit = () => {
  if (feedback > 0 && feedbackMessage.trim() !== '') {
    console.log(`Rating: ${feedback}, Feedback: ${feedbackMessage}`);
    setIsFeedbackSubmitted(true);
    setShowFeedbackInput(false);
  } else {
    alert('Please enter your feedback message.');
  }
};


const chatContainerRef = useRef(null);
useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

// const scrollToBottom = () => {
//   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
// }

// useEffect(() => {
//   scrollToBottom()
// }, [messages])


  return (

  <ThemeProvider theme={darkTheme}>
  <Box 
  width="100vw" 
  height="100%" 
  display={"flex"} 
  flexDirection={'column'} 
  justifyContent={"center"} 
  alignItems={"center"}
  bgcolor={'background.default'}
  color={"text.primary"}
  p={2}
  overflow="hidden"
  >
    <Box 
      width="100%" 
      display="flex" 
      justifyContent="center" 
      alignItems="center"
      position="relative"
      p={2}
      mb={2}
    >
      <Typography 
        variant="h4" 
        color="primary"
        sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}
      >
        Headstarter AI Support
      </Typography>

      {!user ? (
        <Button 
          variant="outlined" 
          color="primary"
          sx={{ 
            position: 'absolute', 
            right: 16, 
            top: 16 
          }}
          onClick={handleLogin}
          disabled={authLoading} // Disable button while auth is in progress
        >
          {authLoading ? 'Loading...' : 'Login'}
        </Button>
      ) : (
        <Button 
          variant="outlined" 
          color="primary"
          sx={{ 
            position: 'absolute', 
            right: 16, 
            top: 16 
          }}
          onClick={handleLogout}
          disabled={authLoading} // Disable button while auth is in progress
        >
          {authLoading ? 'Logging out...' : 'Logout'}
        </Button>
      )}
    </Box>
    <Box display="flex" p={2} alignItems="center">
          <TypingEffect
            text="Headstarter AI, is a platform that conducts AI-powered interviews for software engineering jobs."
            speed={75} color={'secondary'}
          />
        </Box>
      
      

    <Stack
    direction={"column"}
    width={"500px"}
    height={"550px"}
    border={"1px solid #333"}
    p={2}
    spacing={3}
    bgcolor={"Background.paper"}
    overflow={"hidden"}
    borderRadius={2}
    >
      <Stack 
      direction={"column"} 
      spacing={2}
      flexGrow={1}
      overflow="auto"
      maxHeight={"100%"}
      ref={chatContainerRef}
      >
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

    <Box mt={2} display="flex" flexDirection="column" alignItems="center" bgcolor={"Background.paper"}>
          <Typography variant="h6" color="primary">
            Rate your experience:
          </Typography>
          
          <Box display="flex" justifyContent="center" mt={2}>
            {[1, 2, 3, 4, 5].map((value) => (
              <IconButton key={value} onClick={() => handleRatingSubmit(value)}>
                <StarIcon color={feedback >= value ? 'primary' : 'disabled'} />
              </IconButton>
            ))}
          </Box>

          {showFeedbackInput && (
            <Box mt={2} display="flex" flexDirection="column" alignItems="center">
                <TextField label="Your Feedback" multiline rows={4} variant="outlined" value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)} fullWidth sx={{ maxWidth: 500 }} />
                
                <Button variant="contained" color="primary" onClick={handleFeedbackSubmit} sx={{ mt: 2 }}>
                  Submit Feedback
                </Button>
            </Box>
          )}

          {isFeedbackSubmitted && (
            <Typography variant="body1" color="secondary" sx={{ mt: 2 }}>
              Thank you for your feedback!
            </Typography>
          )}
        </Box>
  </Box>
  </ThemeProvider>
)
}
