---
description: Regras estritas de Design e Acessibilidade (A11y) para o desenvolvimento Mobile em React Native/Expo.
globs: ["**/*.tsx", "**/*.ts"]
alwaysApply: true
---
# Padrões de Design e Acessibilidade (Mobile)

## 1. Fidelidade Visual e Design System
- **Pixel Perfect:** Ao receber uma imagem de referência (mockup) ou um design no Figma, os espaçamentos (paddings/margins), tamanhos de fonte, pesos (bold/medium/regular) e cores DEVEM ser replicados com exatidão. Não assuma valores genéricos.
- **Bordas e Sombras:** Preste muita atenção nas bordas de cartões e inputs. Uma borda `border-gray-200` é drasticamente diferente de uma borda preta sólida `border-black`. Replique o estilo de borda correto.
- **Cores da Marca (Tokens):** Utilize os tokens de cor do projeto Siga Mobile (ex: `bg-brand-dark` para `#0A3D24`, `bg-brand-green` para `#18A354`, e as variações corretas do Tailwind). Nunca "invente" tons se já existem na paleta.
- **Tipografia:** Siga a hierarquia de texto. Títulos costumam ser mais pesados (`font-bold` ou `font-black`), enquanto subtítulos e descrições usam `font-medium` ou `font-regular` com cores mais brandas (`text-gray-500` ou `text-gray-400`).

## 2. Acessibilidade (A11y) Obrigatória
- **Tamanho de Alvos de Toque (Touch Targets):** Todo elemento interativo (botões, links, ícones clicáveis) DEVE ter no mínimo `44x44` (ou `48x48`) de área de toque, seguindo diretrizes da Apple e Google. Use `min-h-[44px]` e `min-w-[44px]` ou um padding generoso (`p-3`, `p-4`) em `TouchableOpacity`.
- **Feedback Visual (Active Opacity):** Todos os botões devem prover um feedback visual instantâneo. Use `activeOpacity={0.7}` ou estilos de clique.
- **Contraste de Cores:** Certifique-se de que o texto tenha contraste suficiente com o fundo. Texto branco (`#FFFFFF`) sobre verde escuro (`#0A3D24`) tem excelente contraste. Texto cinza claro sobre fundo branco falha em acessibilidade.
- **Semântica para Leitores de Tela:**
  - Utilize `accessible={true}` em componentes que devem ser lidos como um único bloco.
  - Forneça `accessibilityLabel` em botões apenas de ícone.
  - Defina `accessibilityRole="button"` ou `"header"` apropriadamente.
- **Textos Escaláveis:** Não trave os tamanhos de fonte de forma que impeçam a escala do sistema (evite usar `allowFontScaling={false}` a menos que seja um caso extremo que quebre a UI).

## 3. Layout Responsivo
- Evite larguras ou alturas fixas em pixels duros (ex: `w-[350px]`) que quebram em telas menores. Use `flex-1`, porcentagens (`w-full`), ou flexbox para distruibuição.
- **Áreas Seguras (Safe Areas):** Sempre considere `useSafeAreaInsets` no topo (Header) e no fundo (Tab bar/Home indicator) para evitar que o conteúdo seja cortado por entalhes (notches).

## 4. Estrutura de Componentes
- Separe componentes visuais complexos (Cards, Headers) em arquivos próprios na pasta `/src/components`, seguindo a arquitetura Atomic Design ou a estrutura combinada do projeto. O arquivo de Tela (ex: `/app/minha-tela.tsx`) deve atuar mais como controlador de layout e menos como um "linguição" de Views.
