# poc-fastapi-llm-csv-front

POC Frontend React para integração com API Fastapi Gemini usando LangChain CSV

## Objetivo da Atividade

A atividade tem por objetivo criar um ou mais agentes que tornem possível a um usuário realizar perguntas sobre os arquivos CSV disponibilizados.

Por exemplo:

- Qual é o fornecedor que teve maior montante recebido? 
- Qual item teve maior volume entregue (em quantidade)? E assim por diante.

Faça upload do arquivo: 202401_NFs.zip e envie ao chatbot.

## O que deve ser feito

A solução entregue deverá ter uma interface onde o usuário irá informar sua pergunta e o agente irá gerar a resposta desejada.
Para tanto, o agente deverá descompactar os arquivos, selecionar o arquivo desejado, carregar os dados e fazer as queries e gerar a resposta para o usuário.

Para construir seus agentes, vocês podem optar por escrever programas em Python ou utilizar ferramentas NoCode/LowCode.
Sugerimos os seguintes frameworks/ferramentas:

-https://autogenhub.github.io/autogen/
-https://ai.pydantic.dev/
-https://www.langchain.com/
-https://www.llamaindex.ai/
-https://www.crewai.com/
-https://n8n.io/
-https://www.langflow.org/

Vocês devem usar pelo menos 1 dos frameworks/ferramentas sugeridos.

Ao final de suas atividades, vocês devem gerar um relatório descrevendo:

1.A framework escolhida
2.Como a solução foi estruturada
3.Pelo menos 4 perguntas com as respectivas respostas.
4.Link para a pasta do Github contendo os códigos fonte ou um link para acessar seu agente.
5.Não se esqueçam de ocultar chaves utilizadas nos softwares.

Importante! Não queremos que vocês obtenham as respostas de forma manual utilizando alguma LLM como o ChatGPT. Queremos que o(s) seu(s) agente(s) executem esta tarefa.