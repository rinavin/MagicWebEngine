const
	path = require('path'),
	CopyWebpackPlugin = require('copy-webpack-plugin'),
	webpackAngularExternals = require('webpack-angular-externals'),
	WebpackShellPlugin = require('webpack-shell-plugin'),
	nodeExternals = require('webpack-node-externals');

module.exports = (name)=> ({
		context: path.resolve(__dirname, `./`),
		
		entry    : {
			[name]: `${__dirname}/src/${name}/index.ts`
		},
		output   : {
			path    : path.resolve(__dirname, `./dist/@magic/${name}`),
			filename: 'index.js'
		},
		resolve  : {
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: ['.ts', '.tsx', '.js'] // note if using webpack 1 you'd also need a '' in the array as well
		},
		module   : {
			loaders: [ // loaders will work with webpack 1 or 2; but will be renamed "rules" in future
				// all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
				{test: /\.tsx?$/, loader: 'ts-loader'}
			]
		},
		plugins  : [
			
			/*new WebpackShellPlugin({
				onBuildStart: [],
				onBuildEnd  : [
					// 'cd',
					// `node_modules\\.bin\\cpx.cmd ..\\..\\dist\\ ..\\..\\node_modules`,
				]
			})*/
		
		],
		externals: [
			webpackAngularExternals(),
			'xml2js',
			/^@angular\//,
			/^@magic\//,
			nodeExternals({
				// modulesDir: '../../node_modules'
			})
		]
		
	}
);