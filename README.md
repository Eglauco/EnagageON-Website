# EngageON — Landing Page

Landing page dark premium (1 página) da plataforma **EngageON — Gestão de Engajamento**, com animações GSAP + ScrollTrigger e scroll suave (Lenis).

## Como rodar localmente

Precisa apenas de um servidor estático (por causa das fontes/CDN, não abra via duplo-clique no arquivo):

```bash
npx -y http-server -p 5173 -c-1 .
```

Depois acesse `http://localhost:5173`.

## Estrutura

| Arquivo | O que contém |
|---|---|
| `index.html` | Todo o conteúdo/textos das seções |
| `privacidade.html` | Política de Privacidade (LGPD + Google Play) — página estática, sem JS |
| `suporte/index.html` | Central de suporte (Support URL exigida pela Apple) — página estática, sem JS |
| `css/styles.css` | Design system (cores, fontes) e estilos — tokens no `:root` no topo |
| `css/privacidade.css` | Estilos adicionais da página de privacidade (reusados também no suporte) |
| `css/suporte.css` | Estilos adicionais da página de suporte |
| `js/main.js` | Animações: preloader, ECG do hero, carrossel de funcionalidades, painel de risco, contadores |
| `assets/` | Logo, prints do app e do portal |

## Política de Privacidade (link para o Google Play)

- URL em produção: `https://<seu-dominio>/privacidade.html` — é esse link que vai no campo "Política de Privacidade" do Play Console. Para o requisito de exclusão de conta do Data Safety, use `https://<seu-dominio>/privacidade.html#exclusao-de-conta`.
- ⚠️ **E-mail placeholder**: a página usa `privacidade@engageon.com.br` como canal de privacidade/DPO (6 ocorrências em `privacidade.html`). Antes de enviar o link ao Google, crie essa caixa de e-mail ou substitua pelo endereço real (busque por `privacidade@engageon.com.br` no arquivo).
- Quando a empresa designar formalmente um Encarregado (DPO) — pessoa física ou jurídica —, atualize o nome na seção 16 da página.

## Suporte (Support URL para a Apple)

- URL em produção: `https://<seu-dominio>/suporte/` — é esse link que vai no campo "URL de Suporte" do App Store Connect (também aceito no Google Play, em "Site" do contato).
- Canal de contato: `suporte@futurize.com.br` (confirme que a caixa existe e é monitorada antes de enviar o app para revisão da Apple).

## Decisões de design

- **Cor da marca**: `#465FFF` (extraída da logo), com gradiente para `#9B6BFF`
- **Fontes**: Unbounded (títulos) · Manrope (texto) · JetBrains Mono (dados/labels)
- **Conceito**: "monitor de sinais vitais" da equipe — a linha de pulso da logo aparece no preloader, no hero (interativa ao mouse) e no Painel de Risco recriado em HTML animado
- **Sem CTA por enquanto** (decisão do cliente) — para adicionar depois, criar um botão no hero e/ou seção final
- Estatísticas da seção "Por quê" são **ilustrativas** (há nota de rodapé na página)
- Acessibilidade: `prefers-reduced-motion` respeitado, foco visível, alt em todas as imagens

## Publicação

O site é 100% estático — funciona em GitHub Pages, Vercel, Netlify etc. Basta publicar a pasta inteira (o `index.html` fica na raiz).
