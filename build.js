const Remarkable = require('remarkable')
const fs = require('fs')

const md = new Remarkable()
const content = md.render(fs.readFileSync('./README.md', { encoding: 'utf8' }))

const html = `<!doctype html>
<html>
	<head>
		<meta charset="utf-8">
		<title>Svelte App Tutorial</title>
		<link
			rel="stylesheet"
			href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"
			integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u"
			crossorigin="anonymous"
		>
		<style type="text/css">
		.container {
			margin: 0 auto;
			max-width: 800px;
		}
		</style>
	</head>
	<body>
		<div class="container">
${content}
		</div>
	</body>
</html>
`

fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
