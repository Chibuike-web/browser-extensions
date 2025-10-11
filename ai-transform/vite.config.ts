import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	build: {
		outDir: "dist",
		rollupOptions: {
			input: {
				popup: path.resolve(__dirname, "popup.html"),
				summary: path.resolve(__dirname, "summary.html"),
				background: path.resolve(__dirname, "src/background.ts"),
				content: path.resolve(__dirname, "src/content.ts"),
			},
			output: {
				entryFileNames: "[name].js",
				assetFileNames: "[name].[ext]",
			},
		},
	},
});
