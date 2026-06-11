Arquitetura do SIGA Mobile App
Este documento define a arquitetura oficial, escolhas tecnológicas, padronização de projeto e estilo para o desenvolvimento do novo aplicativo mobile (React Native) baseado na jornada do cliente do SIGA. O objetivo principal é manter a máxima paridade visual e estrutural com o front-end web, garantindo alta performance nativa e reuso de lógicas.

1. Stack Tecnológica Principal
Para viabilizar um tempo de mercado rápido, excelente Developer Experience (DX) e reaproveitamento de conhecimento de React, a stack escolhida é:

Framework Mobile: React Native com Expo (SDK mais recente). O Expo gerencia a complexidade nativa (Android/iOS) e facilita compilações (EAS Build), navegação via arquivos (Expo Router) e atualizações Over-The-Air (OTA).
Linguagem: TypeScript. Tipagem estática rigorosa para compartilhar interfaces e DTOs da API do SIGA com o front-end.
Estilização: NativeWind (TailwindCSS para React Native). Isso permite copiar e colar as mesmas classes (ex: flex, items-center, p-4, bg-primary) usadas no SIGA web. CRÍTICO: Devemos criar componentes base reutilizáveis (<Card>, <PrimaryButton>, <TextField>) para padronizar as telas da plataforma e evitar repetição de dezenas de classes do Tailwind em todo lugar.
Navegação: Expo Router (baseado no React Navigation). Navegação baseada no sistema de arquivos, igual ao Next.js, mantendo uma estrutura mental próxima da web.
Gerenciamento de Estado: Redux Toolkit (RTK). Ferramenta moderna e padronizada para variáveis globais e controle de fluxo.
Consumo de API: RTK Query ou Axios. Se a API possuir muito cache local, o RTK Query (acoplado ao Redux) será superior. Para chamadas REST mais isoladas, Axios.
Formulários: React Hook Form + Zod. Altamente performático (não renderiza em cada tecla) e com tipagem TypeScript segura.
Armazenamento Local: React Native MMKV. Para salvar sessão de usuário e cache. É milhares de vezes mais rápido que o AsyncStorage tradicional, pois roda de forma síncrona no backend em C++.
2. Estruturação do Projeto (Arquitetura de Pastas)
Aplicando as regras de Clean Code e Componentização para máxima reutilização:

text
/siga-mobile
├── /assets                 # Imagens genéricas, ícones nativos e fontes (Inter)
├── /src
│   ├── /app                # Expo Router: Telas da jornada do cliente (Páginas)
│   │   ├── (auth)          # Rotas de quem não está logado (/login, /register)
│   │   ├── (journey)       # Rotas do funil/jornada (/step1, /step2, /checkout)
│   │   └── _layout.tsx     # Definição do layout (Headers nativos, Drawer/Tabs)
│   ├── /components         # Componentes React reutilizáveis
│   │   ├── /atoms          # Componentes básicos (Button, Input, Text, Spinner)
│   │   ├── /molecules      # Junção de átomos (FormField, StepIndicator)
│   │   └── /organisms      # Componentes complexos da jornada (ClientDetailsCard, PaymentForm)
│   ├── /store              # Configuração do Redux
│   │   ├── index.ts        # Store global
│   │   └── /slices         # Redutores divididos por contexto (authSlice, journeySlice)
│   ├── /hooks              # Custom Hooks (useTheme, useAuth, useDebounce)
│   ├── /services           # Camada de comunicação com a API SIGA-Backend
│   │   └── api.ts          # Instância do Axios / Interceptors
│   ├── /utils              # Formatação de Moedas, CNPJ/CPF, Datas (mesmos do web)
│   └── /theme              # Tokens de design (Paleta, Fontes mapeadas para o NativeWind)
Regras de Componentização (Baseadas na Clean Code IDE)
Encapsulamento de UI e Lógica: Se um componente faz uma chamada API complexa para validar um dado, essa lógica deve morar num Custom Hook (ex: useValidateDocument()), deixando o JSX do componente 100% focado apenas em renderizar o layout.
Componentes "Burros" vs "Inteligentes": Componentes na pasta /components/atoms e molecules nunca conectam no Redux. Eles apenas recebem props. Apenas as Telas (no /app) ou Organismos de alto nível injetam dependências do Redux.
3. Variáveis Globais (Redux Slices)
Para gerenciar a "Jornada do Cliente" – que geralmente envolve preencher múltiplos passos antes da submissão final –, precisamos de fatias (slices) muito bem delimitadas no Redux:

A) authSlice (Autenticação)
Estado: { token: string | null, user: UserProfile | null, status: 'idle' | 'loading' | 'failed' }
Uso: Manter a sessão ativa e controlar se o app exibe as rotas (auth) ou (journey).
B) journeySlice (Coração do App)
Nesta fatia, toda a progressão do cliente será salva temporariamente, para que ele não perca dados se sair e voltar para o app.

Estado:
typescript
{
  currentStep: number,        // Ex: Passos de 1 a 5
  clientData: {
     personalInfo: { ... },
     addressInfo: { ... },
     financialInfo: { ... }
  },
  draftId: string | null,     // Se houver rascunho salvo no banco via backend
  isSubmitting: boolean
}
Actions: setPersonalInfo, nextStep, previousStep, resetJourney.
C) uiSlice (Interface)
Estado: { theme: 'light' | 'dark', showToast: { message: '', type: 'success' | 'error' } }
4. Estilos (CSS, Cores e Tipografia)
Para garantir 100% de similaridade com a versão Web, extraímos as variáveis CSS raiz do repositório SIGA e as traduzimos para o tailwind.config.js do projeto NativeWind.

Paleta Shadcn UI (Traduzida)
O mobile deve suportar modo Dark, lendo a preferência do sistema operacional (useColorScheme()).

javascript
// tailwind.config.js (NativeWind)
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
      },
      fontFamily: {
        body: ["Inter_500Medium", "sans-serif"],
        heading: ["Inter_700Bold", "sans-serif"],
      },
    },
  },
};
Tipografia
Fonte Principal: Inter (importada nativamente via @expo-google-fonts/inter).
Escala Base: 16px para o corpo do texto para garantir acessibilidade mínima em mobile.
Considerações Exclusivas de Mobile (UI/UX)
Áreas Seguras (Safe Area): Usar o hook useSafeAreaInsets() do react-native-safe-area-context para evitar que a jornada do cliente seja escondida pelo "notch" (câmera frontal do iPhone/Android) ou pela barra de gestos na base da tela.
Keyboard Avoiding View: Na jornada de cliente, haverão formulários longos. É obrigatório englobar essas telas em um <KeyboardAvoidingView> com <ScrollView> para que o teclado do celular nunca tampe os campos de digitação (Inputs) e o botão "Avançar".
Sombras (Shadows): Como o CSS Box Shadow nativo é diferente, converteremos as variáveis --shadow-s e --shadow-l para elevation no Android e propriedades de cor, offset e opacidade de sombra (ShadowIOS) no iOS via utilitários do NativeWind.
5. Integração e Comunicação com o SIGA-Backend
O aplicativo mobile consumirá a exata mesma API RESTful em Express/Node.js que a plataforma Web já utiliza (siga-backend).

A) Estruturação da Instância do Axios
Para evitar repetição de URLs e gerenciamento manual de tokens em cada requisição, criaremos uma instância centralizada (src/services/api.ts).

typescript
import axios from 'axios';
import { storage } from '../utils/storage'; // Ex: React Native MMKV
// Definindo dinamicamente pelo ambiente (Development vs Production)
const BASE_URL = __DEV__ 
  ? 'http://SEU_IP_LOCAL:5005' // No mobile, 'localhost' ponta pro próprio celular. Precisamos do IP da rede (ex: 192.168.1.X:5005)
  : 'https://api-siga.valtre.com.br';
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});
// Interceptor para injetar o Token em todas as rotas (exceto Auth)
api.interceptors.request.use((config) => {
  const token = storage.getString('siga_logger_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
B) Mapeamento de Rotas (Endpoints)
A montagem das rotas segue a padronização já estabelecida no back-end.

Rotas Públicas (Sem necessidade de Token):

POST /api/auth/login: Recebe { email, password }. Retorna o JWT Token e os dados do usuário. (Devemos salvar o JWT no MMKV imediatamente).
POST /api/auth/register: Cadastro inicial para abrir a jornada do cliente.
Rotas Privadas (Jornada e Propostas - Injetam Authorization Bearer):

GET /api/proposals: Lista as propostas/jornadas em andamento para o usuário logado.
POST /api/proposals: Cria uma nova solicitação/proposta no banco de dados.
PUT /api/proposals/:id: Utilizado para avançar as etapas do formulário (Ex: Salvando dados pessoais na Etapa 1, endereço na Etapa 2).
GET /api/user/profile: Retorna dados do usuário para a tela de Perfil do app.
C) Tratamento de Erros de Autenticação (Refresh/Logout)
Deve ser configurado um interceptor.response na instância do Axios. Se o backend retornar 401 Unauthorized (token expirado), o Axios deve disparar uma ação global para o Redux (authSlice.actions.logout()), forçando o usuário de volta para a tela de Login (/login) imediatamente, garantindo a segurança do app.

