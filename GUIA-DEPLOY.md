# 🚀 Guia de Deploy + Painel Admin (Decap CMS)

Este guia te ensina a:
1. Subir o site para o **GitHub**
2. Hospedar no **Vercel** (ou Netlify)
3. Ativar o **painel administrativo** para postar artigos no blog

---

## 📌 Passo 1 — Subir o site para o GitHub

1. Crie uma conta em [github.com](https://github.com) (se ainda não tiver)
2. Clique em **+** no canto superior direito → **New repository**
3. Nome do repositório: `drpedrobarbosa-pediatria` (ou outro de sua escolha)
4. Marque como **Public** (para usar Decap CMS gratuito) ou **Private** (precisa Netlify pago)
5. **Não** marque nenhuma opção (README, .gitignore, etc.)
6. Clique em **Create repository**

Depois, faça upload dos arquivos:

### Opção mais simples — pelo navegador
- Clique em **uploading an existing file**
- Arraste TODOS os arquivos do site (incluindo a pasta `admin/`)
- Commit message: "Site inicial"
- Clique em **Commit changes**

### Opção avançada — via terminal
```bash
cd pasta-do-site
git init
git add .
git commit -m "Site inicial"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/drpedrobarbosa-pediatria.git
git push -u origin main
```

---

## 📌 Passo 2 — Hospedar no Vercel (recomendado)

> **Importante:** Para o **painel admin** funcionar, você precisa do **Netlify** (que tem o serviço gratuito Identity + Git Gateway). O Vercel também funciona para o site, mas a parte do CMS exige Netlify ou outra solução.
>
> **Recomendação:** use **Netlify** para tudo (mais fácil) — instruções abaixo.

### 🅰️ Usando Netlify (recomendado para o painel admin)

1. Acesse [app.netlify.com](https://app.netlify.com)
2. Crie conta com sua conta do GitHub
3. Clique em **Add new site → Import an existing project**
4. Escolha **GitHub** → autorize o acesso
5. Selecione o repositório `drpedrobarbosa-pediatria`
6. Configurações de build:
   - **Build command:** (deixe vazio)
   - **Publish directory:** `.` (ponto)
7. Clique em **Deploy site**

Pronto! Site no ar em ~30 segundos. Você receberá uma URL tipo `nome-aleatorio.netlify.app`.

#### Configurar domínio próprio (drpedrobarbosapediatra.com.br)
1. Em **Domain settings → Add custom domain**
2. Insira `drpedrobarbosapediatra.com.br`
3. Vá no painel do registro do domínio (Registro.br) → configure DNS:
   - Tipo `A`: `75.2.60.5`
   - Tipo `CNAME` para `www`: `apex-loadbalancer.netlify.com`
4. Aguarde 1-24h para propagar.

### 🅱️ Usando Vercel (apenas se NÃO quiser usar o painel admin)

1. Acesse [vercel.com](https://vercel.com)
2. **Add new → Project**
3. Importe o repo do GitHub
4. Deploy

---

## 📌 Passo 3 — Ativar o Painel Admin (Decap CMS)

> Funciona apenas com **Netlify**. Se você foi de Vercel, precisa migrar.

### 3.1 — Habilitar Identity (sistema de login)
1. No painel do Netlify, abra seu site
2. Vá em **Site configuration → Identity**
3. Clique em **Enable Identity**

### 3.2 — Configurar como funciona o cadastro
1. Em **Identity → Registration preferences**
2. Selecione **Invite only** (apenas convidados — só você e o Dr. Pedro)
3. Em **External providers** (opcional): conecte com Google se quiser
4. Em **Identity → Services → Git Gateway**, clique em **Enable Git Gateway**

### 3.3 — Convidar o Dr. Pedro (e você)
1. Em **Identity**, clique em **Invite users**
2. Insira o e-mail do Dr. Pedro → **Send**
3. Ele receberá um e-mail com link para definir senha
4. Pronto: ele entra em `https://seu-site.com.br/admin/` com login

### 3.4 — Adicionar o widget de login no site
Cole isso no `<head>` do `index.html` (apenas uma vez):
```html
<script src="https://identity.netlify.com/v1/netlify-identity-widget.js"></script>
```

E no final do `<body>`, antes de `</body>`:
```html
<script>
  if (window.netlifyIdentity) {
    window.netlifyIdentity.on("init", user => {
      if (!user) {
        window.netlifyIdentity.on("login", () => {
          document.location.href = "/admin/";
        });
      }
    });
  }
</script>
```

---

## 📌 Passo 4 — Como o Dr. Pedro vai postar artigos

1. Ele acessa: **`https://drpedrobarbosapediatra.com.br/admin/`**
2. Faz login com o e-mail e senha que você cadastrou
3. Aparece o painel com **"Artigos do Blog"** no menu
4. Clica em **+ Novo Artigo**
5. Preenche os campos:
   - Título
   - Subtítulo
   - Data
   - Categoria
   - Imagem de capa
   - Conteúdo (editor visual estilo Word)
   - SEO (palavras-chave, meta descrição)
6. Clica em **Publicar**
7. O artigo é automaticamente:
   - Commitado no GitHub
   - Re-deployado no Netlify
   - Disponível em ~1 minuto no site

---

## ⚠️ Importante: como o blog vai aparecer no site

O Decap salva os artigos como arquivos `.md` (Markdown) na pasta `blog/posts/`. Para aparecerem no site, você precisa de **um sistema que converta o markdown em HTML automaticamente**. Eu vou criar isso na próxima etapa — me avise quando terminar o deploy do Netlify e eu adapto o site para ler dinamicamente os artigos do CMS.

Existem 3 caminhos possíveis:

1. **Mais simples:** Eu adiciono um JS que lista os artigos e converte markdown em HTML em tempo real (funciona, mas SEO mais fraco).
2. **Recomendado:** Migrar para **Astro** ou **Eleventy** (mais trabalho inicial, melhor SEO, build automático).
3. **Híbrido:** Manter o site atual e cada artigo novo eu te ajudo a publicar manualmente seguindo o padrão.

Decidimos isso quando você terminar o deploy.

---

## 🆘 Precisa de ajuda?

Me avise quando:
- ✅ Tiver feito o deploy no Netlify
- ✅ Tiver os IDs do Google Analytics e Google Ads
- ✅ Quiser ajustar qualquer coisa
