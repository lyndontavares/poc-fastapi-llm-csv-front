import React, { useState, useEffect, useRef } from 'react';
import {
  Page,
  PageSection,
  Card,
  CardBody,
  TextInput,
  Button,
  Flex,
  FlexItem,
  Divider,
  EmptyState,
  EmptyStateIcon,
  EmptyStateBody,
  Title
} from '@patternfly/react-core';
import { RobotIcon } from '@patternfly/react-icons'; // Or a user icon if you have one

// Optional: for basic styling, you might want to import PatternFly base styles
import '@patternfly/react-core/dist/styles/base.css';


// Dummy avatar for now (you removed the other image import)
// In a real app, you'd manage avatars properly.
const botAvatar = <RobotIcon size="lg" />;
const userAvatar = null; // Or use a UserIcon from '@patternfly/react-icons'

interface Message {
  text: string;
  sender: 'user' | 'bot';
  id: number;
}

function ChatbotDemo() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null); // To scroll to the bottom

  // Effect to scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (inputValue.trim() === '') return;

    const newUserMessage: Message = { text: inputValue, sender: 'user', id: Date.now() };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // You might send the CSV file here if it's dynamic per query,
      // otherwise, the backend should already have access to the data.
      // For simplicity, let's assume the CSV data is loaded once on the backend startup
      // or managed by the session.
      // This example sends just the query.

      // Form data for query (if your backend expects Form data)
      const formData = new FormData();
      formData.append('query', newUserMessage.text);
      // If you need to send a CSV with each query, uncomment and adjust this:
      // if (csvFile) { // Assuming csvFile is available in component state or props
      //   formData.append('csv_file', csvFile);
      // }

      const response = await fetch('http://localhost:8000/chat_with_agent', {
        method: 'POST',
        // If sending FormData, don't set 'Content-Type' header manually,
        // fetch will set it automatically with the correct boundary.
        // headers: { 'Content-Type': 'application/json' }, // Only for JSON body
        body: formData, // Use formData if your backend endpoint takes Form data
        // body: JSON.stringify({ query: newUserMessage.text }), // Use this if backend expects JSON body
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
      }

      const data = await response.json();
      const botResponse: Message = { text: data.response, sender: 'bot', id: Date.now() + 1 };
      setMessages((prevMessages) => [...prevMessages, botResponse]);

    } catch (error) {
      console.error('Erro ao enviar mensagem para o backend:', error);
      const errorMessage: Message = { text: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente mais tarde.', sender: 'bot', id: Date.now() + 1 };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !isLoading) {
      sendMessage();
    }
  };

  return (
    <Page>
      <PageSection isWidthLimited variant="light">
        <Card style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
          <CardBody style={{ flexGrow: 1, overflowY: 'auto', padding: '16px' }}>
            {messages.length === 0 ? (
              <EmptyState>
                <EmptyStateIcon icon={RobotIcon} />
                <Title headingLevel="h4" size="lg">
                  Olá! Como posso ajudar hoje?
                </Title>
                <EmptyStateBody>
                  Pergunte sobre seus dados CSV.
                </EmptyStateBody>
              </EmptyState>
            ) : (
              messages.map((msg) => (
                <Flex key={msg.id} justifyContent={msg.sender === 'user' ? 'flexEnd' : 'flexStart'} style={{ marginBottom: '10px' }}>
                  <FlexItem style={{ maxWidth: '70%' }}>
                    <Card isPlain style={{ backgroundColor: msg.sender === 'user' ? '#e0f2f7' : '#f0f0f0', borderRadius: '8px', padding: '10px' }}>
                      <Flex alignItems="center">
                        {msg.sender === 'bot' && <FlexItem spacer={{ default: 'sm' }}>{botAvatar}</FlexItem>}
                        <FlexItem>
                          <strong>{msg.sender === 'user' ? 'Você' : 'Bot'}:</strong> {msg.text}
                        </FlexItem>
                        {msg.sender === 'user' && <FlexItem spacer={{ default: 'sm' }}>{userAvatar}</FlexItem>}
                      </Flex>
                    </Card>
                  </FlexItem>
                </Flex>
              ))
            )}
            <div ref={messagesEndRef} /> {/* Scroll target */}
          </CardBody>
          <Divider />
          <CardBody>
            <Flex>
              <FlexItem grow={{ default: 'grow' }}>
                <TextInput
                  value={inputValue}
                  onChange={(_event, value) => setInputValue(value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  isDisabled={isLoading}
                  aria-label="Chat input"
                />
              </FlexItem>
              <FlexItem>
                <Button onClick={sendMessage} isDisabled={isLoading} variant="primary">
                  {isLoading ? 'Enviando...' : 'Enviar'}
                </Button>
              </FlexItem>
            </Flex>
          </CardBody>
        </Card>
      </PageSection>
    </Page>
  );
}

export default ChatbotDemo;