# 🎟️ BazaTicket — Plataforma de Venda de Ingressos de Alta Concorrência

![Angular](https://img.shields.io/badge/Angular-18+-DD0031?style=for-the-badge\&logo=angular\&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge\&logo=tailwind-css\&logoColor=white)
![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=for-the-badge\&logo=dotnet\&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge\&logo=rabbitmq\&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge\&logo=Stripe\&logoColor=white)

O BazaTicket é uma plataforma distribuída de venda de ingressos construída para suportar cenários de altíssima concorrência, semelhante aos grandes sistemas utilizados por empresas como Ticketmaster, Sympla, Eventbrite, Bilheteria Digital, Ingresse e ingresso.com. O projeto foi desenvolvido utilizando uma arquitetura moderna baseada em microsserviços, Event-Driven Architecture e Frontend Enterprise em Angular 18+, com foco em performance, escalabilidade, experiência do usuário e qualidade de engenharia de software.

A proposta principal do sistema é resolver problemas reais de concorrência extrema, onde milhares de usuários tentam comprar o mesmo ingresso ao mesmo tempo, garantindo consistência de dados, prevenção de overbooking e comunicação resiliente entre serviços distribuídos.

---

# 🏛️ Arquitetura e Engenharia do Sistema

O projeto segue padrões avançados de engenharia de software utilizados em aplicações enterprise modernas.

## Padrões Arquiteturais Utilizados

* Clean Architecture
* Domain-Driven Design (DDD)
* Event-Driven Architecture (EDA)
* CQRS (Command Query Responsibility Segregation)
* SAGA Pattern
* Database-per-Service
* API Gateway Pattern
* Feature-Sliced Design no Frontend

---

# ⚙️ Stack Tecnológica

## Frontend

* Angular 18+ (Standalone Components)
* TypeScript
* TailwindCSS
* Angular Signals
* Lazy Loading
* Route-level Code Splitting
* Reactive Forms
* Stripe Elements

## Backend

* .NET 10
* ASP.NET Core
* YARP API Gateway
* MassTransit
* RabbitMQ
* MongoDB

## Infraestrutura

* Docker Compose
* GitHub Actions
* MongoDB Atlas
* CloudAMQP
* Vercel / Render

---

# 🧠 Objetivo Técnico do Sistema

O sistema foi pensado para simular uma plataforma real de venda de ingressos em larga escala, focando em:

* Controle de concorrência em tempo real
* Reservas temporárias de ingressos
* Fluxos distribuídos de pagamento
* Comunicação assíncrona via mensageria
* Rollback automático utilizando SAGA
* Separação total de domínios de negócio
* APIs desacopladas
* Alta disponibilidade
* Escalabilidade horizontal

---

# 🖥️ Frontend Enterprise (Angular)

O frontend é um dos principais focos do projeto e foi estruturado utilizando Domain-Driven Design e Feature-Sliced Architecture.

A aplicação foi organizada para ficar semelhante visualmente e estruturalmente aos maiores sites de venda de ingressos do mundo, priorizando:

* Layout moderno
* Interface premium
* Alta performance
* UX fluida
* Design minimalista
* Responsividade completa
* Navegação rápida
* Experiência semelhante a plataformas SaaS enterprise

O design é fortemente inspirado em:

* Bilheteria Digital
* Sympla
* Ingresse
* ingresso.com
* Ticketmaster
* Eventbrite

O sistema não deve utilizar emojis na interface visual principal. O objetivo é transmitir uma identidade profissional, sofisticada e corporativa.

---

# 🌐 Internacionalização (i18n)

O frontend possui suporte completo para múltiplos idiomas utilizando Angular Signals.

A aplicação possui:

* Botão de troca de idioma
* Alteração dinâmica entre PT-BR e EN-US
* Atualização reativa sem reload da página
* Estrutura preparada para expansão global

O botão de linguagem deve ficar visível na Navbar e seguir um padrão premium semelhante a plataformas SaaS modernas.

---

# 🎨 Design System

O projeto utiliza um Design System próprio construído com TailwindCSS.

Características:

* Dark Mode e Light Mode
* Variáveis CSS globais
* Componentização reutilizável
* Skeleton Loading
* Toasts customizados
* Feedback visual elegante
* Microinterações suaves
* Layout totalmente responsivo

O objetivo visual é criar uma experiência premium semelhante a produtos enterprise modernos.

---

# ⚡ Performance

A aplicação foi projetada para atingir alto desempenho.

Recursos implementados:

* Lazy Loading
* Route-based Code Splitting
* Angular Signals
* Componentes Standalone
* Optimistic UI
* Cache local
* Skeleton Screens
* Carregamento progressivo

O Checkout e Stripe são carregados apenas quando necessários para evitar impacto no First Contentful Paint.

---

# 🔒 Fluxo Distribuído de Compra

O frontend conversa exclusivamente com o YARP API Gateway.

Fluxo:

1. O usuário seleciona o ingresso.
2. O frontend envia uma intenção de reserva.
3. O ReservationService cria um lock temporário do ingresso.
4. Um evento é enviado via RabbitMQ.
5. O PaymentService processa o pagamento.
6. O OrderService finaliza a emissão.
7. Em caso de falha, o SAGA realiza rollback automático.

---

# 📂 Estrutura do Projeto Frontend

```text
src
 ┣ app
 ┃ ┣ core
 ┃ ┃ ┣ auth
 ┃ ┃ ┣ http
 ┃ ┃ ┣ i18n
 ┃ ┃ ┣ loading
 ┃ ┃ ┗ theme
 ┃ ┣ domains
 ┃ ┃ ┣ catalog
 ┃ ┃ ┗ checkout
 ┃ ┣ infrastructure
 ┃ ┣ layout
 ┃ ┣ shared
 ┃ ┣ app.component.ts
 ┃ ┣ app.config.ts
 ┃ ┗ app.routes.ts
 ┣ environments
 ┣ index.html
 ┣ main.ts
 ┗ styles.css
```

---

# 🧩 Organização por Domínio

## Catalog

Responsável pela vitrine de eventos:

* Cards de eventos
* Listagem de ingressos
* Destaques
* Busca
* Categorias

## Checkout

Responsável pelo fluxo de compra:

* Carrinho
* Reserva temporária
* Integração Stripe
* Finalização da compra

## Core

Camada global da aplicação:

* Interceptors
* Autenticação
* Tema
* Internacionalização
* Loading global

## Shared

Componentes reutilizáveis:

* Toasts
* Loaders
* Chatbot
* Componentes visuais genéricos

---

# 🔥 Microsserviços do Backend

## TicketCatalogService

Responsável pelos eventos e catálogo.

## ReservationService

Gerencia concorrência e locks atômicos.

## PaymentService

Processa pagamentos.

## OrderService

Finaliza pedidos e emissão digital.

## GatewayService

Centraliza acesso via YARP.

---

# 🛡️ Recursos Avançados Planejados

* Dead Letter Queues (DLQ)
* Retry Policies
* Idempotência
* Rate Limiting
* Observabilidade
* Logs distribuídos
* Métricas
* Health Checks
* CI/CD completo
* Deploy Cloud Native

---

# 🚀 Executando o Projeto

## Pré-requisitos

* Node.js 18+
* Angular CLI
* Docker
* .NET 10
* MongoDB
* RabbitMQ

---

## Instalação Frontend

```bash
git clone https://github.com/yunkbaza/TicketWeb
cd TicketWeb
npm install
npm start
```

Aplicação:

```bash
http://localhost:4200
```

---

# 🔧 Configuração de Ambiente

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5130',
  stripePublicKey: 'pk_test_xxxxxxxxx'
};
```

---

# 👨‍💻 Autor

## Allan Gabriel Baeza Amirati Silva

Software Engineer focado em:

* Arquitetura de Software
* Sistemas Distribuídos
* Frontend Enterprise
* Microsserviços
* Engenharia Backend
* Alta Performance
* Cloud Native Applications
* Engenharia de Plataforma
