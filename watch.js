const fs = require('fs')
const exec = require('child_process').exec
const chokidar = require('chokidar')
const debounce = require('debounce')

const builders = [
		...fs.readdirSync('./manual'),
		...fs.readdirSync('./builder')
	]
	.reduce((map, section) => {
		map[section] = debounce(() => {
			console.log(`building ${section}`)
			const number = /[^-]+/.exec(section)[0]
			exec(`npm run build:${number}`, error => {
				if (error) {
					console.log(`error building ${section}`, error)
				}
			})
		}, 500, true)
		return map
	}, {})

function builderHandler(event, path) {
	const section = /[^\/]+/.exec(path)[0]
	builders[section]()	
}

// the manually built sections have all JS files ignored

chokidar
	.watch('./**', {
		cwd: './manual',
		ignoreInitial: true,
		ignored: [ '.DS_Store', './**/*.js' ]
	})
	.on('all', builderHandler)

// while the builder sections have their built JS files ignored

chokidar
	.watch('./**', {
		cwd: './builder',
		ignoreInitial: true,
		ignored: [ '.DS_Store', './**/build.js', './**/*.build.js' ]
	})
	.on('all', builderHandler)

// the website builder is a simpler machine

const websiteBuilder = debounce(() => {
	console.log('building website')
	exec(`npm run build:website`, error => {
		if (error) {
			console.log(`error building website`, error)
		}
	})
}, 500, true)

chokidar
	.watch([ 'README.md', 'build.js' ])
	.on('change', websiteBuilder)
