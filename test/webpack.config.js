const
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	name = 'Test',
	webpackAngularExternals = require('webpack-angular-externals');


module.exports = {
	entry    : {
		[name]: './index.ts'
	},
	output   : {
		path         : path.resolve(__dirname, `dist`),
		filename     : 'index.js',
		libraryTarget: "commonjs"
	},
	resolve  : {
		// Add `.ts` and `.tsx` as a resolvable extension.
		extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
	},
	module   : {
		loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
			// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
			{test: /\.tsx?$/, loader: 'ts-loader'}
		],
		
	},
	plugins  : [
		// new webpack.IgnorePlugin(/@angular/),
		
		/*
				new CopyWebpackPlugin([
						
						// Copy directory contents to {output}/to/directory/
						{
							from: `../../dist/@magic/${name}/!**!/!*.*`,
							to  : `../../../node_modules/@magic/${name}/`
						}
					],
					{
						copyUnmodified: true
					})
		*/
	],
	externals: [
		/^@angular\//
	]
};