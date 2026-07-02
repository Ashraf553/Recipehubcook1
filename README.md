# RecipeHub 🍳

Современный SPA-сайт с рецептами в стиле iOS 26 «Liquid Glass» и
ИИ-шеф-ассистентом, который помогает приготовить блюдо из того, что
есть под рукой.

## Стек

- **Vite** + **React** + **TypeScript**
- **Tailwind CSS v4** — дизайн-токены через CSS-переменные (светлая/тёмная тема,
  динамический акцент по категории блюда)
- **Zustand** — `useThemeStore`, `useRecipeStore`, `useFilterStore`, `useAssistantStore`
- **react-router-dom** — клиентский роутинг + `React.lazy` code-splitting по страницам
- **Framer Motion** — пружинные анимации, bottom sheet, появление карточек
- **lucide-react** — иконки
- **Express** (`/server`) — лёгкий прокси к Anthropic API, чтобы ключ не попадал в браузер

## Структура проекта

```
src/
  components/   UI-компоненты (GlassCard, RecipeCard, Navbar, BottomSheet, ChatBubble, ...)
  pages/        Страницы под роуты (Home, Categories, CategoryRecipes, RecipeDetail, Favorites, Assistant)
  stores/       Zustand-хранилища
  data/         Типы и мок-данные (15 демо-рецептов, 8 категорий)
  hooks/        useAccentStyle, useLockBodyScroll, useCountdown
  lib/          api.ts (клиент чата), format.ts, cn.ts
server/
  index.js      Express-прокси: POST /api/chat -> Anthropic API
```

## Установка и запуск

```bash
npm install
```

Понадобится 2 процесса: Vite (фронтенд) и Express (прокси для ИИ-ассистента).

### 1. Настрой ключ Anthropic API

```bash
cp server/.env.example server/.env
# и впиши свой ключ в server/.env
# ANTHROPIC_API_KEY=sk-ant-...
```

Ключ читается только на сервере и никогда не уходит в браузер.

### 2. Запусти оба процесса одной командой

```bash
npm run dev:all
```

Это поднимет Vite на `http://localhost:5173` и Express-прокси на
`http://localhost:3001`. Vite дев-сервер проксирует все запросы `/api/*`
на Express (см. `vite.config.ts`), так что фронтенд всегда обращается
просто к `/api/chat`.

Либо запусти процессы отдельно в двух терминалах:

```bash
npm run dev      # фронтенд (Vite)
npm run server   # прокси-бэкенд (Express)
```

### Без ключа Anthropic

Приложение полностью работает без ключа — все страницы с рецептами,
фильтры, избранное и темы доступны сразу. Без `ANTHROPIC_API_KEY`
заработает только чат с ассистентом: сервер вернёт понятную ошибку
вместо ответа ИИ.

### Продакшен-сборка

```bash
npm run build     # tsc + vite build -> dist/
npm run preview   # локальный просмотр сборки
```

Для продакшена Express-прокси нужно задеплоить отдельно (например, как
serverless-функцию или отдельный сервис) и указать его адрес в качестве
цели для `/api` — либо на уровне реверс-прокси/CDN перед статикой,
либо переменной окружения в хостинге фронтенда.

## Дизайн

Стиль «Liquid Glass»: полупрозрачные поверхности с `backdrop-blur`,
мягкие тени, крупные скругления (`rounded-glass`, `rounded-pill`),
пружинные анимации Framer Motion и плавающие цветные пятна на фоне.
Акцентный цвет автоматически меняется в зависимости от категории блюда
(см. `src/data/categories.ts` и `useAccentStyle`). Тема (светлая/тёмная)
переключается через `useThemeStore` и хранится в `localStorage`.

## Демо-данные

15 типизированных рецептов (`src/data/recipes.ts`) покрывают все
8 категорий: завтраки, супы, основные блюда, салаты, десерты, выпечка,
напитки, веганское. Структура готова к замене на реальный API/БД —
достаточно реализовать те же функции (`getRecipeById`,
`getRecipesByCategory`) на стороне сервера.
