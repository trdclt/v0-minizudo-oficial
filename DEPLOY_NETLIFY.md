# Deploy para Netlify - meu-hotwheels.com

## Passos para Deploy

### 1. Preparar o Repositório
- Faça commit de todos os arquivos para seu repositório Git
- Certifique-se de que os seguintes arquivos estão incluídos:
  - `app/api/chat/route.ts` (API route para o chat)
  - `components/FloatingChat.tsx` (componente do chat)
  - `netlify.toml` (configuração do Netlify)

### 2. Conectar ao Netlify

#### Opção A: Via Interface do Netlify
1. Acesse [netlify.com](https://netlify.com)
2. Clique em "Add new site" → "Import an existing project"
3. Conecte seu repositório Git (GitHub, GitLab, etc.)
4. Selecione o repositório do projeto
5. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Framework**: Next.js

#### Opção B: Via Netlify CLI
\`\`\`bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Login no Netlify
netlify login

# Deploy
netlify deploy --prod
\`\`\`

### 3. Configurar Variáveis de Ambiente

No painel do Netlify:
1. Vá em **Site settings** → **Environment variables**
2. Adicione a variável:
   - **Key**: `NEXT_PUBLIC_N8N_WEBHOOK_URL`
   - **Value**: [URL do seu webhook n8n]

### 4. Configurar Domínio Customizado

1. No painel do Netlify, vá em **Domain settings**
2. Clique em **Add custom domain**
3. Digite: `meu-hotwheels.com`
4. Siga as instruções para configurar os DNS:
   - Adicione um registro A apontando para o IP do Netlify
   - OU adicione um CNAME apontando para seu site Netlify

### 5. Verificar Deploy

Após o deploy:
1. Acesse https://meu-hotwheels.com
2. Teste o chat clicando no botão do WhatsApp
3. Envie uma mensagem para verificar a integração com n8n

## Troubleshooting

### API Route retorna 404
- Verifique se o arquivo `app/api/chat/route.ts` está no repositório
- Confirme que o build foi concluído com sucesso
- Verifique os logs de build no Netlify

### Webhook não funciona
- Confirme que a variável `NEXT_PUBLIC_N8N_WEBHOOK_URL` está configurada
- Verifique se a URL do webhook está correta
- Teste o webhook diretamente com uma ferramenta como Postman

### Domínio não funciona
- Aguarde a propagação DNS (pode levar até 48 horas)
- Verifique se os registros DNS estão corretos
- Use [dnschecker.org](https://dnschecker.org) para verificar a propagação
