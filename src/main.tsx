import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@patternfly/react-core/dist/styles/base.css';
import { ChatbotDemo3 } from './ChatBotDemo3';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <ChatbotDemo3 />
    {/*
    <App />
    <ChatbotDemo />
    <ChatbotDemo2 />  */}
  </StrictMode>,
)

 

//https://www.svgrepo.com/svg/448936/assistant
//https://www.patternfly.org/patternfly-ai/chatbot/overview/demo/basic-chatbot/
//https://github.com/patternfly/chatbot/tree/main/packages/module/patternfly-docs/content/extensions/chatbot/examples
//https://github.com/patternfly/chatbot/blob/main/packages/module/patternfly-docs/content/extensions/chatbot/examples/demos/Chatbot.tsx
//https://github.com/patternfly/chatbot/tree/main/packages/module/patternfly-docs