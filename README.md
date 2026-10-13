# Para Vitória ♡

Landing page feita com HTML, CSS e JavaScript, sem instalação de dependências.

## Personalizar

- Edite todas as mensagens em [`dist/conteudo.js`](dist/conteudo.js).
- As legendas do carrossel 3D também ficam em `carrossel`, nesse mesmo arquivo.
- A lista `galeria` define a ordem e as mensagens das 16 fotos que saem da caixa conforme a rolagem.
- Para trocar uma foto, substitua o arquivo correspondente em `dist/fotos/` mantendo o nome (`foto-01.jpeg` até `foto-16.jpeg`).
- O visual e as animações ficam em `dist/style.css` e `dist/main.js`.

## Abrir localmente

Na pasta do projeto, execute `python3 -m http.server 8000 --directory dist` e acesse `http://localhost:8000`.

As fotos originais permanecem na raiz do projeto. As cópias com nomes curtos em `dist/fotos/` são as usadas pela página.

O carrossel avança sozinho quando está visível e também aceita setas, teclado e arrasto. A caixa de memórias só avança quando a pessoa rola a página. Em dispositivos com redução de movimento ativada, o avanço automático e os efeitos contínuos são desligados; as 16 fotos continuam disponíveis no álbum final.

## Publicação

O GitHub Pages publica automaticamente o conteúdo de `dist/` quando há uma alteração na branch `main`. As fotos em `dist/fotos/` ficam públicas junto com a página.
