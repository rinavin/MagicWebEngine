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
			library: "MyLib",
			libraryTarget: "umd",
			
			
			path    : path.resolve(__dirname, `./dist/@magic/${name}`),
			filename: 'index.js'
		},
		resolve  : {
			// Add `.ts` and `.tsx` as a resolvable extension.
			extensions: ['.ts', '.tsx', '.js']
		},
		module   : {
			loaders: [
				{test: /\.tsx?$/, loader: 'ts-loader'}
			]
		},
		plugins  : [
			new CopyWebpackPlugin([
				{ from: `./src/${name}/.npmignore` },
				{ from: `./src/${name}/package.json` },

				]),
			
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