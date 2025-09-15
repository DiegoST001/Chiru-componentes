# Copilot Instructions for Chiru Frontend

## Architecture and Structure

- The project is a frontend for an e‑commerce site built with **Astro.js** (hybrid SSG/SSR) and **React** for interactive components.
- It follows the **Atomic Design** pattern: components are organized into `atoms/`, `molecules/`, `organisms/`, and `templates/` under the `components` directory.
- Routing is file-based under `pages`, with built‑in multi‑language support via `[locale]/`.
- The main layouts live in `layouts` (e.g. `Layout.astro` for general pages and `DocsLayout.astro` for documentation), both using explicit prop typing.

### Astro

> Astro is an all‑in‑one web framework for building websites.

- Astro uses an island architecture and server‑first design to minimize client‑side JavaScript and deliver high‑performance sites.
- Its content‑focused features—like content collections and built‑in Markdown support—make it ideal for blogs, marketing sites, and e‑commerce.
- The `.astro` templating syntax provides robust server rendering in an HTML‑standard format that feels familiar to JSX users.
- Astro supports popular UI frameworks (React, Vue, Svelte, Preact, Solid) through official integrations.
- Powered by Vite, Astro offers a fast dev server, automatic bundling of JS/CSS, and an enjoyable development experience.

#### Documentation Sets

> A list of the documentation sets available to help developers understand and use Astro, with the URLs displayed according to the context of the conversation.

- [Abridged documentation](https://docs.astro.build/llms-small.txt): a compact version of the documentation for Astro, with non-essential content removed
- [Complete documentation](https://docs.astro.build/llms-full.txt): the full documentation for Astro
- [API Reference](https://docs.astro.build/_llms-txt/api-reference.txt): terse, structured descriptions of Astro’s APIs
- [How-to Recipes](https://docs.astro.build/_llms-txt/how-to-recipes.txt): guided examples of adding features to an Astro project
- [Build a Blog Tutorial](https://docs.astro.build/_llms-txt/build-a-blog-tutorial.txt): a step-by-step guide to building a basic blog with Astro
- [Deployment Guides](https://docs.astro.build/_llms-txt/deployment-guides.txt): recipes for how to deploy an Astro website to different services
- [CMS Guides](https://docs.astro.build/_llms-txt/cms-guides.txt): recipes for how to use different content management systems in an Astro project
- [Backend Services](https://docs.astro.build/_llms-txt/backend-services.txt): advice on how to integrate backend services like Firebase, Sentry, and Supabase in an Astro project
- [Migration Guides](https://docs.astro.build/_llms-txt/migration-guides.txt): advice on how to migrate a project built with another tool to Astro
- [Additional Guides](https://docs.astro.build/_llms-txt/additional-guides.txt): guides to e-commerce, authentication, testing, and digital asset management in Astro projects

#### Notes

- The complete documentation includes all content from the official Astro docs.
- All content is auto‑generated from the same sources as the official documentation.

#### Optional

- [The Astro blog](https://astro.build/blog/): the latest news on Astro development.

## 🌐 Internationalization

- The i18n system supports Spanish, English, and Chinese, with smart fallbacks and automatic browser‑language detection.
- Translations are stored in `i18n` and accessed via hooks/utilities (`useLocalizePage`, `getStaticLanguagePaths`).
- Translation key types are auto‑generated for autocomplete and type safety.

## 🎨 Styling

- Uses **Tailwind CSS 4.x** via a Vite plugin, imported in `global.css`.
- The `cntl` utility (`cntl.ts`) composes Tailwind classes in a readable, conditional way.
- Documentation‑specific styles live in `docs.css`.

## ⚙️ Workflows and Commands

- **Development:** `npm run dev`
- **Build:** `npm run build`
- **Preview:** `npm run preview`
- **Formatting:** `npm run format` and `npm run format:check`
- Both build and preview use Astro to generate static HTML, hydrating React only where needed.

## Conventions and Patterns

- React components hydrate with directives like `client:load`, `client:visible`, etc.
- Layouts use explicit prop typing (`interface Props { ... }`).
- Absolute imports use the `@/` alias (configured in `tsconfig.json`).
- `.astro` files accept typed props and named slots.
- The `index.astro` file automatically redirects based on the user’s preferred language.

## Extensions and Configuration

- Recommended VS Code extensions are listed in `extensions.json` (Astro, Tailwind, Prettier, JSON Synchronizer, etc.).
- Prettier is set as the default formatter, with support for `.astro` files.
- Editor color settings and other preferences are specified in `settings.json`.
