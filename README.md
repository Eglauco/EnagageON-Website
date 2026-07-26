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
| `css/styles.css` | Design system (cores, fontes) e estilos — tokens no `:root` no topo |
| `js/main.js` | Animações: preloader, ECG do hero, showcase pinado, painel de risco, contadores |
| `assets/` | Logo, prints do app e do portal |

## Decisões de design

- **Cor da marca**: `#465FFF` (extraída da logo), com gradiente para `#9B6BFF`
- **Fontes**: Unbounded (títulos) · Manrope (texto) · JetBrains Mono (dados/labels)
- **Conceito**: "monitor de sinais vitais" da equipe — a linha de pulso da logo aparece no preloader, no hero (interativa ao mouse) e no Painel de Risco recriado em HTML animado
- **Sem CTA por enquanto** (decisão do cliente) — para adicionar depois, criar um botão no hero e/ou seção final
- Estatísticas da seção "Por quê" são **ilustrativas** (há nota de rodapé na página)
- Acessibilidade: `prefers-reduced-motion` respeitado, foco visível, alt em todas as imagens

## Publicação

O site é 100% estático — funciona em GitHub Pages, Vercel, Netlify etc. Basta publicar a pasta inteira (o `index.html` fica na raiz).
