# InfoTech Solutions — Página Web com Segurança da Informação

Projeto acadêmico desenvolvido para a disciplina de **Segurança da Informação**  
Curso: Análise e Desenvolvimento de Sistemas  

---

## 📌 Estrutura do Projeto
```/
├── index.html # Página inicial
├── services.html # Página de serviços
├── contact.html # Página de contato (com formulário)
├── manifest.webmanifest
├── css/
│ └── styles.css # Estilos globais
└── js/
|    ├── main.js # Script principal (CSRF, criptografia simulada, SW)
|    └── sw.js # Service Worker (modo offline / disponibilidade)
```
---

## 🔐 Princípios de Segurança Aplicados
- **Integridade**:  
  - Conteúdo do site controlado por arquivos estáticos (não alteráveis pelo usuário).  
  - Política de segurança de conteúdo (CSP) restringe recursos apenas ao domínio próprio.  

- **Confidencialidade**:  
  - Formulário de contato com **criptografia simulada no cliente** (Web Crypto API).  
  - Token anti-CSRF e honeypot contra spam/bots.  
  - Observação: em produção, usar **HTTPS (TLS)** e criptografia real no servidor.  

- **Disponibilidade**:  
  - **Service Worker** para cache offline das páginas.  
  - Manifest PWA permitindo experiência resiliente.  

---

## 🚀 Como Executar Localmente

1. Baixe/clonar este projeto.  
2. Abra a pasta no **VS Code** (ou outro editor).  
3. Rode um servidor local para habilitar o Service Worker:  
   - Opção simples: instalar [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) no VS Code e clicar em **Go Live**.  
   - Ou via Node.js:  
     ```bash
     npx serve
     ```  
4. Abra no navegador: [http://localhost:3000](http://localhost:3000) (ou porta indicada).  

---

## 📄 Observações
- Este projeto tem caráter **didático**.  
- Em um ambiente real, recomenda-se:  
  - Servidor configurado com **HTTPS (TLS)**.  
  - Cabeçalhos de segurança (CSP, HSTS, X-Frame-Options, etc).  
  - Armazenamento seguro de chaves e dados.  
  - Monitoramento e redundância real de infraestrutura.  

---

✍️ Desenvolvido para a disciplina de **Segurança da Informação** — InfoTech Solutions (empresa fictícia).