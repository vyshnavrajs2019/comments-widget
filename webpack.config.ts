import { WebpackConfiguration } from "webpack-dev-server";
import HTMLWebpackPlugin from "html-webpack-plugin";

const config: WebpackConfiguration = {
	entry: "./src/index.ts",
	devServer: {
		hot: true,
		watchFiles: ["./public/index.html"],
		open: true,
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				include: /src/,
				use: "ts-loader",
			},
			{
				test: /\.css$/,
				include: /src/,
				use: ["style-loader", "css-loader"],
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: "Interview",
			template: "./public/index.html",
		}),
	],
	optimization: {
		runtimeChunk: "single",
	},
	resolve: {
		extensions: [".ts", ".js"],
	},
};

export default config;
