# Resumo das Alterações — Integração do Logotipo (v8)

Este documento detalha os trechos de código que foram modificados para substituir o texto "BGCAR" pelo logotipo oficial (`img/logo.jpeg`) em todo o projeto.

---

## 1. Alterações no `index.html`

### Navbar (Barra de Navegação)
Substituímos o texto estático pela tag de imagem com uma classe específica para controle de tamanho.

**Antes:**
```html
<a href="index.html" class="navbar-logo">
  BGCAR
</a>
```

**Depois:**
```html
<a href="index.html" class="navbar-logo">
  <img src="img/logo.jpeg" alt="BGCAR Motors Logo" class="logo-img" />
</a>
```

### Footer (Rodapé)
Atualizamos o nome da classe e inserimos a imagem do logo.

**Antes:**
```html
<div class="footer-brand-name">BGCAR</div>
```

**Depois:**
```html
<div class="footer-brand-logo">
  <img src="img/logo.jpeg" alt="BGCAR Motors Logo" class="footer-logo-img" />
</div>
```

---

## 2. Alterações no `area-logada.html`

### Tela de Login
O logo agora aparece centralizado acima dos campos de usuário e senha.

**Antes:**
```html
<div class="login-logo">BGCAR</div>
```

**Depois:**
```html
<div class="login-logo">
  <img src="img/logo.jpeg" alt="BGCAR Motors Logo" class="login-logo-img" />
</div>
```

### Sidebar (Barra Lateral Administrativa)
O logo foi inserido no topo do menu de gestão.

**Antes:**
```html
<div class="sidebar-logo-text">BGCAR</div>
```

**Depois:**
```html
<div class="sidebar-logo-brand">
  <img src="img/logo.jpeg" alt="BGCAR Motors Logo" class="sidebar-logo-img" />
</div>
```

---

## 3. Novas Regras no `style.css`

Adicionamos estas regras ao final do arquivo para garantir que o logo fique sempre nítido e com o tamanho correto, sem distorções.

```css
/* ── Estilos do Logo ─────────────────────────────────────── */
.logo-img {
  height: 45px;      /* Altura padrão na navbar */
  width: auto;       /* Mantém a proporção original */
  display: block;
  transition: 0.3s;  /* Transição suave ao rolar a página */
}

/* Diminui o logo quando a navbar encolhe (scroll) */
.scrolled .logo-img {
  height: 38px;
}

/* Tamanho do logo no rodapé */
.footer-logo-img {
  height: 50px;
  width: auto;
  margin-bottom: 1.5rem;
}

/* Tamanho do logo na tela de login */
.login-logo-img {
  max-width: 180px;
  height: auto;
  margin: 0 auto 1.5rem;
  display: block;
}

/* Tamanho do logo no menu lateral (painel) */
.sidebar-logo-img {
  height: 40px;
  width: auto;
  margin-bottom: 0.5rem;
}
```

---
**Dica:** Certifique-se de que o arquivo de imagem na pasta `img/` tenha exatamente o nome `logo.jpeg` para que os links funcionem corretamente.
