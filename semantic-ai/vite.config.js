import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
	],
	build: {
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, "src/main.tsx"),
				background: path.resolve(__dirname, "src/background.ts"),
				content: path.resolve(__dirname, "src/content.ts"),
			},
			output: {
				entryFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
		outDir: "dist",
	},
});
