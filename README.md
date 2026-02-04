# electron-shadcn

Electron in all its glory. Everything you will need to develop your beautiful desktop application.

![Demo GIF](https://github.com/LuanRoger/electron-shadcn/blob/main/images/demo.png)

## Libs and tools

To develop a Electron app, you probably will need some UI, test, formatter, style or other kind of library or framework, so let me install and configure some of them to you.

### Core 🏍️

- [Electron 40](https://www.electronjs.org)
- [Vite 7](https://vitejs.dev)

### DX 🛠️

- [TypeScript 5.9](https://www.typescriptlang.org)
- [oRPC](https://orpc.unnoq.com)
- [Prettier](https://prettier.io)
- [Ultracite with Biome](https://www.ultracite.ai/providers/biome)
- [Zod 4](https://zod.dev)
- [React Query (TanStack)](https://react-query.tanstack.com)

### UI 🎨

- [React 19.2](https://reactjs.org)
- [Tailwind 4](https://tailwindcss.com)
- [Shadcn UI](https://ui.shadcn.com)
- [Geist](https://vercel.com/font) as default font
- [i18next](https://www.i18next.com)
- [TanStack Router](https://tanstack.com/router) (with file based routing)
- [Lucide](https://lucide.dev)

### Test 🧪

- [Vitest](https://vitest.dev)
- [Playwright](https://playwright.dev)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro)

### Packing and distribution 📦

- [Electron Forge](https://www.electronforge.io)

### CI/CD 🚀

- Pre-configured [GitHub Actions workflow](https://github.com/LuanRoger/electron-shadcn/blob/main/.github/workflows/playwright.yml), for test with Playwright

### Project preferences 🎯

- Use Context isolation
- [React Compiler](https://react.dev/learn/react-compiler) is enabled by default.
- `titleBarStyle`: hidden (Using custom title bar)
- Geist as default font
- Some default styles was applied, check the [`styles`](https://github.com/LuanRoger/electron-shadcn/tree/main/src/styles) directory
- React DevTools are installed by default

## How to use

1. Clone this repository

```bash
git clone https://github.com/LuanRoger/electron-shadcn.git
```

Or use it as a template on GitHub

2. Install dependencies

```bash
npm install
```

3. Run the app

```bash
npm run start
```

Now you can go directly to `/src/routes/index.tsx` and modify the app as you want.

> You can also delete the `/src/routes/second.tsx` file if you don't want a second page.

## Auto update

> [!WARNING]
> This feature only work in open-source repositories in GitHub, if you need to use in a private repository, you need to setup a custom update server. Check the [Updating Applications](https://www.electronjs.org/docs/latest/tutorial/updates) section in the Electron documentation for more details.

The auto update uses GitHub Releases as source for the updates. The `publish` script will automatically create a new release with the version specified in your `package.json` file. You can run locally the `publish` script to create a new release, but you need to set the `GITHUB_TOKEN` environment variable with a GitHub Personal Access Token that has permission to create releases in your repository.

You can also use the GitHub Actions workflow to automatically create a new release when you push a new tag to the repository. The workflow need to be triggered manually, but you can modify to fit your needs. Also, the release is created as draft by default, so you can review and set a proper description before publish.

> Check the [`.github/workflows/publish.yml`](https://github.com/LuanRoger/electron-shadcn/blob/main/.github/workflows/publish.yaml) file for more details.

When you open the app, it will check for updates automatically. If an update is available, it will download and install the update, after that, it will restart the app to apply the update. This ensure  that your users always have the latest version of your app.

The auto update is implemented using [update-electron-app](https://github.com/electron/update-electron-app) to check the updates and apply them. For the publishing, it is using the [Electron Forge's GitHub publisher](https://www.electronforge.io/config/publishers/github).

## Documentation

Check out the full documentation [here](https://docs.luanroger.dev/electron-shadcn).

## Used by

- [yaste](https://github.com/LuanRoger/yaste) - yaste (Yet another super ₛᵢₘₚₗₑ text editor) is a text editor, that can be used as an alternative to the native text editor of your SO, maybe.
- [eletric-drizzle](https://github.com/LuanRoger/electric-drizzle) - shadcn-ui and Drizzle ORM with Electron.
- [Wordle Game](https://github.com/masonyekta/wordle-game) - A Wordle game which features interactive gameplay, cross-platform compatibility, and integration with a custom Wordle API for word validation and letter correctness.
- [Mehr 🌟](https://github.com/xmannii/MehrLocalChat) - A modern, elegant local AI chatbot application using Electron, React, shadcn/ui, and Ollama.

> Does you've used this template in your project? Add it here and open a PR.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/LuanRoger/electron-shadcn/blob/main/LICENSE) file for details.
