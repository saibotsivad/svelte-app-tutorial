const Remarkable = require('remarkable')
const markdownToc = require('markdown-toc')
const fs = require('fs')

const md = new Remarkable({
	html: true,
	typographer: true
}).use(function(mark) {
	mark.renderer.rules.heading_open = (tokens, idx) => {
		return '<h' + tokens[idx].hLevel + ' id=' + markdownToc.slugify(tokens[idx + 1].content) + '>'
	}
})

const readme = fs.readFileSync('./README.md', { encoding: 'utf8' })
const toc = md.render(markdownToc(readme, { maxdepth: 1 }).content)
const content = md.render(readme)

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
		.table-of-contents {
			font-size: 20px;
		}
		.table-of-contents a:nth-child(2) {
			font-size: 75%;
		}
		.table-of-contents a:nth-child(2):before {
			content: "(";
		}
		.table-of-contents a:nth-child(2):after {
			content: ")";
		}
		</style>
	</head>
	<body>
		<div class="container">
			<h1>Svelte App Tutorial</h1>
			<p class="lead">Table of Contents</p>
			<div class="table-of-contents">
				${toc}
			</div>
			${content}
		</div>
	</body>
</html>
`

fs.writeFileSync('./index.html', html, { encoding: 'utf8' })
