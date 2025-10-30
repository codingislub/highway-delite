// Lightweight replacement for "vite/client" types to avoid TS errors when Vite types are not installed.
// If you have Vite as a dependency, you can restore the original line and/or install Vite and its types via:
//   npm install --save-dev vite
// or
//   pnpm add -D vite
declare global {
  interface ImportMetaEnv {
	readonly MODE?: string;
	readonly BASE_URL?: string;
	readonly DEV?: boolean;
	readonly PROD?: boolean;
	[key: string]: string | boolean | undefined;
  }

  interface ImportMeta {
	readonly env: ImportMetaEnv;
  }
}

export {};
