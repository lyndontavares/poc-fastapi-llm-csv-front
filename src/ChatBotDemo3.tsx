import { useEffect, useRef, useState, FunctionComponent, MouseEvent } from 'react';
import { Bullseye, Brand, DropdownList, DropdownItem, DropdownGroup, SkipToContent } from '@patternfly/react-core';

import ChatbotToggle from '@patternfly/chatbot/dist/dynamic/ChatbotToggle';
import Chatbot, { ChatbotDisplayMode } from '@patternfly/chatbot/dist/dynamic/Chatbot';
import ChatbotContent from '@patternfly/chatbot/dist/dynamic/ChatbotContent';
import ChatbotWelcomePrompt from '@patternfly/chatbot/dist/dynamic/ChatbotWelcomePrompt';
import ChatbotFooter, { ChatbotFootnote } from '@patternfly/chatbot/dist/dynamic/ChatbotFooter';
import MessageBar from '@patternfly/chatbot/dist/dynamic/MessageBar';
import MessageBox from '@patternfly/chatbot/dist/dynamic/MessageBox';
import Message, { type MessageProps } from '@patternfly/chatbot/dist/dynamic/Message';
import ChatbotConversationHistoryNav, {
  type Conversation
} from '@patternfly/chatbot/dist/dynamic/ChatbotConversationHistoryNav';
import ChatbotHeader, {
  ChatbotHeaderMenu,
  ChatbotHeaderMain,
  ChatbotHeaderTitle,
  ChatbotHeaderActions,
  ChatbotHeaderSelectorDropdown,
  ChatbotHeaderOptionsDropdown
} from '@patternfly/chatbot/dist/dynamic/ChatbotHeader';

import ExpandIcon from '@patternfly/react-icons/dist/esm/icons/expand-icon';
import OpenDrawerRightIcon from '@patternfly/react-icons/dist/esm/icons/open-drawer-right-icon';
import OutlinedWindowRestoreIcon from '@patternfly/react-icons/dist/esm/icons/outlined-window-restore-icon';

import PFHorizontalLogoColor from '/PF-HorizontalLogo-Color.svg';
import PFHorizontalLogoReverse from '/PF-HorizontalLogo-Reverse.svg';
import PFIconLogoColor from '/PF-IconLogo-Color.svg';
import PFIconLogoReverse from '/PF-IconLogo-Reverse.svg';
import userAvatar from '/user_avatar.svg';
import patternflyAvatar from '/patternfly_avatar.svg';
//import { getTrackingProviders } from '@patternfly/chatbot/dist/dynamic/tracking';
//import { InitProps } from '@patternfly/chatbot/dist/dynamic/tracking';
import '@patternfly/react-core/dist/styles/base.css';
import '@patternfly/chatbot/dist/css/main.css';
import React from 'react';

const footnoteProps = {
  label: 'ChatBot uses AI. Check for mistakes.',
  popover: {
    title: 'Verify information',
    description: `While ChatBot strives for accuracy, AI is experimental and can make mistakes. We cannot guarantee that all information provided by ChatBot is up to date or without error. You should always verify responses using reliable sources, especially for crucial information and decision making.`,
    bannerImage: {
      src: 'https://cdn.dribbble.com/userupload/10651749/file/original-8a07b8e39d9e8bf002358c66fce1223e.gif',
      alt: 'Example image for footnote popover'
    },
    cta: {
      label: 'Dismiss',
      onClick: () => {
        alert('Do something!');
      }
    },
    link: {
      label: 'View AI policy',
      url: 'https://www.redhat.com/'
    }
  }
};

const markdown = 
`A atividade tem por objetivo criar um ou mais agentes que tornem possível a um usuário realizar perguntas sobre os arquivos CSV disponibilizados.
Perguntas:
- Quantas notas ficais foram emitidas?
- Qual o valor médio dos itens das notas fiscais emitidas na cidade de São Paulo?
- Qual a UF que teve o maior valor total emitido? 
- Retorne as 3 UF com a maior quantidade de notas fiscais emitidas juntamente com os valores de total de quantidade, soma do valor total e menor valor de nota fiscal.
- Qual destinatário teve o maior montante de notas fiscais emitidas juntamente com o valor?

> Dica: hashtag #sql: o agente irá fazer uma consulta SQL. 

`
const markdown2 = `Um parágrafo com *ênfase* e **forte importância**.

> Uma citação em bloco com ~riscado~ e uma URL: https://reactjs.org.

Exemplo de código em linha - \`() => void\`

Um código em JavaScript:

~~~js
const MessageLoading = () => (
  <div className="pf-chatbot__message-loading">
    <span className="pf-chatbot__message-loading-dots">
      <span className="pf-v6-screen-reader">Loading message</span>
    </span>
  </div>
);

export default MessageLoading;

~~~
`;

// It's important to set a date and timestamp prop since the Message components re-render.
// The timestamps re-render with them.
const date = new Date();


/* interface InitProps {
    [key: string]: string | number | boolean;
}
const initProps: InitProps = {
  verbose: false,
  segmentKey: 'TODO-key', // TODO add your key here
  posthogKey: 'TODO-key',
  umamiKey: 'TODO-key',
  umamiHostUrl: 'http://localhost:3000', // TODO where is your Umami installation?
  console: true,
  something: 'test'
}; */

/* const tracking = getTrackingProviders(initProps);
tracking.identify('user-123'); // , { superUser: true } TODO get real user id + properties
tracking.trackPageView(window.location.href); */

//const actionEventName = 'MessageAction';

const initialMessages: MessageProps[] = [
  {
    id: '1',
    role: 'user',
    content: 'Olá, você pode me dar exemplo perguntas para o 1º trabalho da I2A2?',
    name: 'User',
    avatar: userAvatar,
    timestamp: date.toLocaleString(),
    avatarProps: { isBordered: true }
  },
  {
    id: '2',
    role: 'bot',
    content: markdown,
    name: 'Bot',
    avatar: patternflyAvatar,
    timestamp: date.toLocaleString(),
    /* actions: {
      positive: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Good response' }) },
      negative: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Bad response' }) },
      copy: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Copy' }) },
      download: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Download' }) },
      listen: { onClick: () => tracking.trackSingleItem(actionEventName, { response: 'Listen' }) }
    } */
  }
];

const welcomePrompts = [
  {
    title: 'Set up account',
    message: 'Choose the necessary settings and preferences for your account.'
  },
  {
    title: 'Troubleshoot issue',
    message: 'Find documentation and instructions to resolve your issue.'
  }
];

const initialConversations = {
  Hoje: [{ id: '1', text: 'Olá, você pode me dar um exemplo do que você pode fazer?' }],
  'Este mês': [
    {
      id: '2',
      text: 'Instalação e configuração do Enterprise Linux'
    },
    { id: '3', text: 'Solucionar falha do sistema' }
  ],
  Março: [
    { id: '4', text: 'Segurança e atualizações do Ansible' },
    { id: '5', text: 'Certificação Red Hat' },
    { id: '6', text: 'Documentação do usuário Lightspeed' }
  ],
  Fevereiro: [
    { id: '7', text: 'Assistência com pod travando' },
    { id: '8', text: 'Pipelines de OpenShift AI' },
    { id: '9', text: 'Atualizando plano de assinatura' },
    { id: '10', text: 'Opções de licenciamento Red Hat' }
  ],
  Janeiro: [
    { id: '11', text: 'Desempenho do sistema RHEL' },
    { id: '12', text: 'Gerenciar contas de usuário' }
  ]
};

//const actionEvent2 = 'ActionEvent2';

export const ChatbotDemo3: FunctionComponent = () => {

  const [chatbotVisible, setChatbotVisible] = useState<boolean>(true);
  const [displayMode, setDisplayMode] = useState<ChatbotDisplayMode>(ChatbotDisplayMode.fullscreen);
  const [messages, setMessages] = useState<MessageProps[]>(initialMessages); //initialMessages
  const [selectedModel, setSelectedModel] = useState('Gemini Pro');
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [conversations, setConversations] = useState<Conversation[] | { [key: string]: Conversation[] }>(
    initialConversations
  );
  const [announcement, setAnnouncement] = useState<string>();
  const scrollToBottomRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const chatbotRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLButtonElement>(null);

  const [filesToUpload, setFilesToUpload] = useState([]);

  // Auto-scrolls to the latest message
  useEffect(() => {
    // don't scroll the first load - in this demo, we know we start with two messages
    if (messages.length > 2) {
      scrollToBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const onSelectModel = (_event: MouseEvent<Element, MouseEvent> | undefined, value: string | number | undefined) => {
    setSelectedModel(value as string);
    //tracking.trackSingleItem('ModelSelected', { model: value });
  };

  const onSelectDisplayMode = (
    _event: MouseEvent<Element, MouseEvent> | undefined,
    value: string | number | undefined
  ) => {
    setDisplayMode(value as ChatbotDisplayMode);
  };

  // you will likely want to come up with your own unique id function; this is for demo purposes only
  const generateId = () => {
    const id = Date.now() + Math.random();
    return id.toString();
  };

  async function callAPI(message: string) {

    if (filesToUpload.length > 0) {
      return await fettchResponseCSV(message);
    } else {
      return await fettchResponse(message)
    }
  }

  async function fettchResponse(message: string) {
    //setLoading(true);
    let retorno = '';
    try {

      const payload = JSON.stringify({ prompt: message });
      const resposta = await fetch('http://127.0.0.1:8000/chat/gemini', {
        method: 'POST',
        body: payload,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      if (!resposta.ok) {
        throw new Error('Erro ao carregar JSON');
      }
      const json = await resposta.json();
      console.log('Resposta do servidor:', json);

      if (json['response'] !== undefined) {
        retorno = json['response'];
      }

    } catch (erro) {
      console.error('Erro:', erro);
    } finally {
      //setLoading(false);
    }
    return retorno
  }


  async function fettchResponseCSV(message: string) {

    let retorno = '';
    const sql = message.toLowerCase().includes('sql');
    const url = sql ? 'upload_csv_batch_and_query_with_sql_agent' : 'upload_zip_and_query_with_pandas_agent'

    try {

      const payload = new FormData();
      if (sql) {

        // o método append do FormData geralmente não sabe como serializar um array de forma que o FastAPI 
        // interprete como list[UploadFile].
        //Quando você envia vários arquivos com FormData, você precisa anexar cada arquivo individualmente
        // com o mesmo nome de campo.

        if (filesToUpload && filesToUpload.length > 0) {
          for (let i = 0; i < filesToUpload.length; i++) {
            payload.append('files', filesToUpload[i]);
          }
        }


      } else[
        payload.append('file', filesToUpload[0])
      ]
      payload.append('question', message);

      console.log('question:', message);
      console.log('files:', filesToUpload);

      //const payload = JSON.stringify({ file: filesToUpload[0], question: message });


      const resposta = await fetch(`http://127.0.0.1:8000/${url}`, {
        method: 'POST',
        body: payload,
      })

      if (!resposta.ok) {
        throw new Error('Erro ao carregar JSON');
      }

      setFilesToUpload([]);
      const json = await resposta.json();
      console.log('Resposta do servidor:', json);

      if (json['answer'] !== undefined) {
        retorno = json['answer'];
      }

    } catch (erro) {
      console.error('Erro:', erro);
    } finally {
      //setLoading(false);
    }
    return retorno
  }


  async function handleSend(message: string) {

    setIsSendButtonDisabled(true);
    //tracking.trackSingleItem('UserInputReceived', { text: message });
    const newMessages: MessageProps[] = [];
    // We can't use structuredClone since messages contains functions, but we can't mutate
    // items that are going into state or the UI won't update correctly
    messages.forEach((message) => newMessages.push(message));
    // It's important to set a timestamp prop since the Message components re-render.
    // The timestamps re-render with them.
    const date = new Date();
    newMessages.push({
      id: generateId(),
      role: 'user',
      content: message,
      name: 'User',
      avatar: userAvatar,
      timestamp: date.toLocaleString(),
      avatarProps: { isBordered: true }
    });

    //Chamada para a API


    newMessages.push({
      id: generateId(),
      role: 'bot',
      content: 'API response goes here',
      name: 'Bot',
      isLoading: true,
      avatar: patternflyAvatar,
      timestamp: date.toLocaleString()
    });



    setMessages(newMessages);
    // make announcement to assistive devices that new messages have been added
    setAnnouncement(`Message from User: ${message}. Message from Bot is loading.`);


    const resposta = await callAPI(message)
    // this is for demo purposes only; in a real situation, there would be an API response we would wait for
    //setTimeout(() => {
    const loadedMessages: MessageProps[] = [];

    newMessages.forEach((message) => loadedMessages.push(message));
    loadedMessages.pop();
    loadedMessages.push({
      id: generateId(),
      role: 'bot',
      content: resposta,//'API response goes here',
      name: 'Bot',
      isLoading: false,
      avatar: patternflyAvatar,
      timestamp: date.toLocaleString(),
      /* actions: {
        positive: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Good response' }) },
        negative: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Bad response' }) },
        copy: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Copy' }) },
        download: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Download' }) },
        listen: { onClick: () => tracking.trackSingleItem(actionEvent2, { response: 'Listen' }) }
      } */
    });
    setMessages(loadedMessages);
    // make announcement to assistive devices that new message has loaded
    setAnnouncement(`Message from Bot: API response goes here`);
    //tracking.trackSingleItem('BotResponded', { undefined });
    setIsSendButtonDisabled(false);
    //}, 5000);
  };


  const findMatchingItems = (targetValue: string) => {
    let filteredConversations = Object.entries(initialConversations).reduce((acc, [key, items]) => {
      const filteredItems = items.filter((item) => item.text.toLowerCase().includes(targetValue.toLowerCase()));
      if (filteredItems.length > 0) {
        acc[key] = filteredItems;
      }
      return acc;
    }, {});

    // append message if no items are found
    if (Object.keys(filteredConversations).length === 0) {
      filteredConversations = [{ id: '13', noIcon: true, text: 'No results found' }];
    }
    return filteredConversations;
  };

  const horizontalLogo = (
    <Bullseye>
      <Brand className="show-light" src={PFHorizontalLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFHorizontalLogoReverse} alt="PatternFly" />
    </Bullseye>
  );

  const iconLogo = (
    <>
      <Brand className="show-light" src={PFIconLogoColor} alt="PatternFly" />
      <Brand className="show-dark" src={PFIconLogoReverse} alt="PatternFly" />
    </>
  );

  const handleSkipToContent = (e) => {
    e.preventDefault();
    /* eslint-disable indent */
    switch (displayMode) {
      case ChatbotDisplayMode.default:
        if (!chatbotVisible && toggleRef.current) {
          toggleRef.current.focus();
        }
        if (chatbotVisible && chatbotRef.current) {
          chatbotRef.current.focus();
        }
        break;

      case ChatbotDisplayMode.docked:
        if (chatbotRef.current) {
          chatbotRef.current.focus();
        }
        break;
      default:
        if (historyRef.current) {
          historyRef.current.focus();
        }
        break;
    }
    /* eslint-enable indent */
  };

  function handleFileUpload(files) {
    // This is where you would handle file uploads
    // For this demo, we will just log the file to the console  
    console.log(files);
    setFilesToUpload(files);
  }

  return (
    <>
      <SkipToContent onClick={handleSkipToContent} href="#">
        Skip to chatbot
      </SkipToContent>
      <ChatbotToggle
        tooltipLabel="Chatbot"
        isChatbotVisible={chatbotVisible}
        onToggleChatbot={function () {
          setChatbotVisible(!chatbotVisible);
          //tracking.trackSingleItem('Chatbot Visible', { isVisible: !chatbotVisible }); // TODO correct?
        }}
        id="chatbot-toggle"
        ref={toggleRef}
      />
      <Chatbot isVisible={chatbotVisible} displayMode={displayMode} ref={chatbotRef}>
        <ChatbotConversationHistoryNav
          displayMode={displayMode}
          onDrawerToggle={() => {
            setIsDrawerOpen(!isDrawerOpen);
            setConversations(initialConversations);
          }}
          isDrawerOpen={isDrawerOpen}
          setIsDrawerOpen={setIsDrawerOpen}
          activeItemId="1"
          // eslint-disable-next-line no-console
          onSelectActiveItem={(e, selectedItem) => console.log(`Selected history item with id ${selectedItem}`)}
          conversations={conversations}
          onNewChat={() => {
            setIsDrawerOpen(!isDrawerOpen);
            setMessages([]);
            setConversations(initialConversations);
          }}
          handleTextInputChange={(value: string) => {
            if (value === '') {
              setConversations(initialConversations);
            }
            // this is where you would perform search on the items in the drawer
            // and update the state
            const newConversations: { [key: string]: Conversation[] } = findMatchingItems(value);
            setConversations(newConversations);
          }}
          drawerContent={
            <>
              <ChatbotHeader>
                <ChatbotHeaderMain>
                  <ChatbotHeaderMenu
                    ref={historyRef}
                    aria-expanded={isDrawerOpen}
                    onMenuToggle={() => setIsDrawerOpen(!isDrawerOpen)}
                  />
                  <ChatbotHeaderTitle
                    displayMode={displayMode}
                    showOnFullScreen={horizontalLogo}
                    showOnDefault={iconLogo}
                  ></ChatbotHeaderTitle>
                </ChatbotHeaderMain>
                <ChatbotHeaderActions>
                  <ChatbotHeaderSelectorDropdown value={selectedModel} onSelect={onSelectModel as any}>
                    <DropdownList>
                      <DropdownItem value="Gemini Pro" key="gemini">
                        Gemini Pro
                      </DropdownItem>
                      <DropdownItem value="Llama 3.0" key="llama">
                        Llama 3.0
                      </DropdownItem>
                      <DropdownItem value="Mistral 3B" key="mistral">
                        Mistral 3B
                      </DropdownItem>
                    </DropdownList>
                  </ChatbotHeaderSelectorDropdown>
                  <ChatbotHeaderOptionsDropdown onSelect={onSelectDisplayMode as any}>
                    <DropdownGroup label="Display mode">
                      <DropdownList>
                        <DropdownItem
                          value={ChatbotDisplayMode.default}
                          key="switchDisplayOverlay"
                          icon={<OutlinedWindowRestoreIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.default}
                        >
                          <span>Overlay</span>
                        </DropdownItem>
                        <DropdownItem
                          value={ChatbotDisplayMode.docked}
                          key="switchDisplayDock"
                          icon={<OpenDrawerRightIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.docked}
                        >
                          <span>Dock to window</span>
                        </DropdownItem>
                        <DropdownItem
                          value={ChatbotDisplayMode.fullscreen}
                          key="switchDisplayFullscreen"
                          icon={<ExpandIcon aria-hidden />}
                          isSelected={displayMode === ChatbotDisplayMode.fullscreen}
                        >
                          <span>Fullscreen</span>
                        </DropdownItem>
                      </DropdownList>
                    </DropdownGroup>
                  </ChatbotHeaderOptionsDropdown>
                </ChatbotHeaderActions>
              </ChatbotHeader>
              <ChatbotContent>
                {/* Update the announcement prop on MessageBox whenever a new message is sent
                 so that users of assistive devices receive sufficient context  */}
                <MessageBox announcement={announcement} key='chatbot-message-box'>
                  <ChatbotWelcomePrompt
                    key='chatbot-welcome-prompt'
                    title="Bem-vindo ao ChatBot MetaMind!"
                    description="I2A2 - Agentes Autonômicos Inteligentes"
                  /* prompts={welcomePrompts} */
                  />
                  {/* This code block enables scrolling to the top of the last message.
                  You can instead choose to move the div with scrollToBottomRef on it below
                  the map of messages, so that users are forced to scroll to the bottom.
                  If you are using streaming, you will want to take a different approach;
                  see: https://github.com/patternfly/chatbot/issues/201#issuecomment-2400725173 */}
                  {messages.map((message, index) => {
                    if (index === messages.length - 1) {
                      return (
                        <>
                          <React.Fragment key={"msg-group-" + index}>
                            <div ref={scrollToBottomRef}></div>
                            <Message key={message.id} {...message} />
                          </React.Fragment>
                        </>
                      );
                    }
                    return <Message key={message.id} {...message} />;
                  })}
                </MessageBox>
              </ChatbotContent>
              <ChatbotFooter>
                <MessageBar
                  onSendMessage={(event) => { handleSend(event as string) }}
                  hasMicrophoneButton
                  isSendButtonDisabled={isSendButtonDisabled}
                  handleAttach={handleFileUpload}
                />
                <ChatbotFootnote {...footnoteProps} />
              </ChatbotFooter>
            </>
          }
        ></ChatbotConversationHistoryNav>
      </Chatbot>
    </>
  );
};