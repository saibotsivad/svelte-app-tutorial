<!--
title: Building an application with Svelte
description: A tutorial showing how to use Svelte to build an interactive application.
pubdate: 2017-03-16
author: Tobias Davis
authorURL: http://saibotsivad.com
-->

# Building an application with Svelte

In the lineup of possible JS frameworks, a newer one has come out recently, and
tickles my fancy: [Svelte](https://svelte.technology/), designed by
the infamous [Rich Harris](https://twitter.com/Rich_Harris), is a
"framework without the framework".

You can read the official [Svelte guide](https://svelte.technology/guide),
but I thought it would be more useful to walk you through what a web
application looks like when made with Svelte.

### What we'll be making

In this tutorial we will build a very basic web app that lets you create
and edit records like a real business-type app would do. We'll build an
animal address book. It's like an address book, but for animals! 🐐🐶🦄

### Follow along

Each section of this tutorial is in a sub-folder of this repo. You can
build and view all the different sections like this:

```bash
git clone https://github.com/saibotsivad/svelte-app-tutorial.git
cd svelte-app-tutorial
npm install
npm run build
npm run start
```

Then open [http://localhost:8001/](http://localhost:8001/) in your browser.

## 0. Fast introduction to Svelte

Much like Rich Harris' other JS contribution, [RactiveJS](http://www.ractivejs.org/),
Svelte promotes the idea that components are written as plain old HTML files.

Here's a very simple component:

```html
<!-- HelloWorld.html -->
<h1>Hello {{name}}!</h1>
```

That's the whole component!

The `{{name}}` is a [mustache](http://mustache.github.io/)-like syntax unique
to Svelte (it has some extra bits of functionality). When the component property
updates, the template will too.

Svelte compiles the component to a JavaScript file. Later in the tutorial
we'll use a build system (like Rollup, Gulp, Grunt, or Browserify). The simplest
way to get started is to use [svelte-cli](https://github.com/sveltejs/svelte-cli):

```bash
npm install -g svelte-cli
svelte compile --format iife HelloWorld.html > HelloWorld.js
```

> Note: The flag `--format iife` means that we can use the compiled JavaScript
> file in the browser directly. It's handy for this tutorial and when you're
> playing around, but later we will learn how to compile the Svelte components
> into modules and bundle multiple components into a single JavaScript file
> like you would in a real web app.

To use the component, create an `index.html` file that looks like this:

```html
<!DOCTYPE html>
<html>
<head>
	<title>Hello World!</title>
</head>
<body>
	<div id="main"></div>
	<script src="HelloWorld.js"></script>
	<script>
		var app = new HelloWorld({
			target: document.getElementById('main'),
			data: {
				name: 'world'
			}
		})
		setTimeout(function() {
			app.set({ name: 'everyone' })
		}, 5000)
	</script>
</body>
</html>
```

If you open this file in your browser (try `open index.html` from the
command line) you'll see the header element render as "Hello world!",
and 5 seconds later change to "Hello everyone!".

**Lesson summary:**

Components are single HTML files that we compile into JavaScript files
and use in the browser.

## 1. Child Components: Getting started

Our address book will have two main views: a list of all the animals we
know, and a view for looking at each animal separately. Let's start by
building the list view.

Let's start with a list of entries that looks like this:

```html
<ul>
	<li>Goat: goat@animals.com</li>
	<li>Dog: dog@animals.com</li>
</ul>
```

We want to spice up the list elements, so let's try something like this:

```html
<li>
	<h1>🐐 Goat</h1>
	(<a href="mailto:goat@animals.com">email</a>,
	<a href="https://twitter.com/EverythingGoats">twitter</a>)
</li>
```

Let's write that as a Svelte component:

```html
<!-- ListEntry.html -->
<li>
	<h1>{{emoji}} {{name}}</h1>
	(<a href="mailto:{{email}}">email</a>,
	<a href="https://twitter.com/{{twitter}}">twitter</a>)
</li>
```

This component doesn't have any state, it just takes the properties
it's given and displays them. These are the best kind of components,
because they are the easiest to reason about.

Let's make the parent component, to see how using child components works:

```html
<!-- List.html -->
<ul>
	{{#each animals as animal}}
	<ListEntry
		name="{{animal.name}}"
		emoji="{{animal.emoji}}"
		email="{{animal.email}}"
		twitter="{{animal.twitter}}"
		/>
	{{/each}}
</ul>

<script>
import ListEntry from './ListEntry.html'

export default {
	components: {
		ListEntry
	}
}
</script>
```

For component code, Svelte has you specify a `script` element, in which
you can specify things like default data, helper functions to use in your
component, and more.

Here we are saying that the `List` component uses the `ListEntry` component.

Let's compile all this together, and make sure our app works so far:

```bash
svelte compile --format iife ListEntry.html > ListEntry.js
svelte compile --format iife List.html > List.js
```

> Note: When you compile `List.html` it will complain that no name is
> specified for the imported module `./ListEntry.html`. This is fine
> for now, we will make the build smarter later on in this tutorial.

Then we will make an `index.html` like this:

```html
<!DOCTYPE html>
<html>
<head>
	<title>Animal Phone Book</title>
	<!-- IMPORTANT! Set the encoding so emoji show up correctly! -->
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
</head>
<body>
	<div id="main"></div>
	<script src="ListEntry.js"></script>
	<script src="List.js"></script>
	<script>
		var app = new List({
			target: document.getElementById('main'),
			data: {
				animals: [{
					name: 'Goat',
					emoji: '🐐',
					email: 'goat@animal.com',
					twitter: 'EverythingGoats'
				},{
					name: 'Dog',
					emoji: '🐶',
					email: 'dog@animal.com',
					twitter: 'dog_rates'
				}]
			}
		})
	</script>
</body>
</html>
```

If you open this in your browser, you should see a page that,
although not very pretty, lists two entries: one for Goat, and
one for Dog.

### Lessons learned: Child components

Using components inside other components requires you to specify which
component you're using in the default export of the `<script>` tag :

```html
<div>
	<ChildComponent />
</div>

<script>
import ChildComponent from './ChildComponent.html'

export default {
	components: { ChildComponent }
}
</script>
```

Passing parameters to a child component is as simple as setting a
named attribute on the HTML element:

```html
<div>
	<ChildComponent componentProperty="{{parentProperty}}" />
</div>
```

## 2. Interacting with components

Our little app displays data, but we want to be able to add, edit, and
delete animal contacts from our list. Let's setup adding first.

You can imagine some input form that looks like this:

```html
<h1>Add Animal</h1>
<form action="POST">
	<p>
		<label for="new-animal-name">Name</label>
		<input type="text" name="new-animal-name">
	</p>
	<p>
		<label for="new-animal-emoji">Emoji</label>
		<input type="text" name="new-animal-emoji">
	</p>
	<p>
		<label for="new-animal-email">Email</label>
		<input type="text" name="new-animal-email">
	</p>
	<p>
		<label for="new-animal-twitter">Twitter</label>
		<input type="text" name="new-animal-twitter">
	</p>
	<button type="submit">Create Animal</button>
</form>
```

If we rewrote that as a component, it might look something like:

```html
<!-- AddAnimal.html -->
<h1>Add Animal</h1>
<form on:submit="handleSubmit(event)">
	<p>
		<label for="new-animal-name">Name</label>
		<input bind:value="name" type="text" name="new-animal-name">
	</p>
	<p>
		<label for="new-animal-emoji">Emoji</label>
		<input bind:value="emoji" type="text" name="new-animal-emoji">
	</p>
	<p>
		<label for="new-animal-email">Email</label>
		<input bind:value="email" type="text" name="new-animal-email">
	</p>
	<p>
		<label for="new-animal-twitter">Twitter</label>
		<input bind:value="twitter" type="text" name="new-animal-twitter">
	</p>
	<button type="submit">Create Animal</button>
</form>

<script>
export default {
	methods: {
		handleSubmit(event) {
			// prevent the page from reloading
			event.preventDefault()

			const animal = {
				name: this.get('name'),
				emoji: this.get('emoji'),
				email: this.get('email'),
				twitter: this.get('twitter')
			}
			console.log('animal', animal)
		}
	}
}
</script>
```

The `bind:value="name"` means that, when the text in the input
element is updated, you can do `this.get('name')` to get the
updated value.

To see this in action, you'll need to:

### Add the component to the main view

Update the `List.html` file to look like this:

```html
<!-- List.html -->
<ul>
	{{#each animals as animal}}
	<ListEntry
		name="{{animal.name}}"
		emoji="{{animal.emoji}}"
		email="{{animal.email}}"
		twitter="{{animal.twitter}}"
		/>
	{{/each}}
</ul>

<AddAnimal />

<script>
	import ListEntry from './ListEntry.html'
	import AddAnimal from './AddAnimal.html'

	export default {
		components: {
			ListEntry,
			AddAnimal
		}
	}
</script>
```

Remember that you need to import the component and add it to the
default export `components` property.

### Add the script to the HTML

Update the `index.html` so that the `<script>` elements are:

```html
<script src="AddAnimal.js"></script>
<script src="ListEntry.js"></script>
<script src="List.js"></script>
```

### Compile the changed components

Re-compile the new and changed components:

```bash
svelte compile --format iife List.html > List.js
svelte compile --format iife AddAnimal.html > AddAnimal.js
```

### Make it better

If everything works correctly, when you open the `index.html`
page in your browser, you'll see a form that you can type into,
and when you click the button will log the new animal to the
console.

What you will also notice is that the input elements all
say `undefined`, and if you click the button without changing
those properties, they will remain undefined.

The reason this happens is 






