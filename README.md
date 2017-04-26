# Building an application with Svelte

In the lineup of possible JS frameworks, a newer one has come out recently, and
tickles my fancy: [Svelte](https://svelte.technology/), designed by
the infamous [Rich Harris](https://twitter.com/Rich_Harris), is a
"framework without the framework".

You can read the official [Svelte guide](https://svelte.technology/guide),
but I thought it would be useful to walk you through what a "serious"
web application might look like when made with Svelte.

## What we'll be making

In this tutorial we will build a very basic web app that lets you create
and edit records like a real business-type app would do. We'll build an
animal address book. It's like an address book, but for animals! 🐐🐶🦄

## Follow along

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

# 0. Fast introduction to Svelte <small>[demo](./manual/0-intro/)</small>

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
		}, 3000)
	</script>
</body>
</html>
```

If you open this file in your browser (try `open index.html` from the
command line) you'll see the header element render as "Hello world!",
and 5 seconds later change to "Hello everyone!".

###### 0. Section summary [demo](./manual/0-intro/)

Components are written as single HTML files that we compile into
JavaScript files.

We can use those components as composable widgets, without needing
to use a full framework.

# 1. Child Components: Getting started [demo](./manual/1-child/)

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
	&middot;
	<a href="mailto:goat@animals.com">email</a>
	&middot;
	<a href="https://twitter.com/EverythingGoats">twitter</a>
</li>
```

Let's write that as a Svelte component:

```html
<!-- ListEntry.html -->
<li>
	<h1>{{entry.emoji}} {{entry.name}}</h1>
	{{#if entry.email}}
		&middot;
		<a href="mailto:{{entry.email}}">email</a>
	{{/if}}
	{{#if entry.twitter}}
		&middot;
		<a href="https://twitter.com/{{entry.twitter}}">twitter</a>
	{{/if}}
</li>
```

This component doesn't have any internal "state", it just takes the
properties it's given and displays them. These are the best kind of
components, because they are the easiest to reason about.

The `#if` and `/if` properties are Svelte template syntax markers for
conditionally displaying the content between the curly braces if the
referenced property (in this case if `entry.email` or `entry.twitter`)
exists.

Let's make the parent component, to see how we use child components:

```html
<!-- List.html -->
<ul>
	{{#each animals as animal}}
		<ListEntry entry="{{animal}}" />
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

The `#each` and `/each` properties are Svelte template syntax markers
for looping through lists and adding the content between curly braces
for each list entry.

> Note: In addition to the `#each list as item` you can reference
> the entry index using `#each list as item, index` and then use
> the `index` property like a normal variable in the template.

JavaScript code for the component goes inside the `<script>` element,
and you can specify things like: default data, helper functions that
you can use in your component, and more cool things.

The important thing to note is that the `<script>` element needs to
[export](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export)
an object as the default export, and you'll need to
[import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)
and list each child component it uses in the exported
`components` object.

> Note: The syntax `{ ListEntry }` is ES6 shorthand
> for `{ ListEntry: ListEntry }`.

For now, this component only needs to specify that the `List`
component uses the `ListEntry` component.

Let's compile all this together, and make sure our app works so far:

```bash
svelte compile --format iife ListEntry.html > ListEntry.js
svelte compile --format iife List.html > List.js
```

> Note: For the early sections of this tutorial, when you compile
> a component it might complain "no name is specified for the
> imported module". This error is fine for now, but later on in this
> tutorial we will make the build smarter so those errors go away.

Then we will make an `index.html` like this:

```html
<!DOCTYPE html>
<html>
<head>
	<title>Animal Phone Book</title>
	<!--
	IMPORTANT! In order for the emoji to show up correctly, you
	will probably need to set this <meta> element as shown here!
	-->
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

###### 1. Section summary [demo](./manual/1-child/)

Using components inside other components requires you to specify which
component you're using in the default export of the `<script>` tag, and
passing parameters to a child component is as simple as setting a
named attribute on the HTML element:

```html
<ChildComponent componentProperty="{{parentProperty}}" />

<script>
import ChildComponent from './ChildComponent.html'

export default {
	components: { ChildComponent }
}
</script>
```

# 2. Interacting with components [demo](./manual/2-interact/)

Our little app displays data, but we want to be able to add, edit, and
delete animal contacts from our list. Let's think about how to add
animals first.

You can imagine a normal input form that looks like this:

```html
<h1>Add Animal</h1>
<form action="http://site.com/api/add_animal" method="POST">
	<p>
		<label for="animal-name">Name</label>
		<input type="text" name="animal-name">
	</p>
	<p>
		<label for="animal-emoji">Emoji</label>
		<input type="text" name="animal-emoji">
	</p>
	<p>
		<label for="animal-email">Email</label>
		<input type="text" name="animal-email">
	</p>
	<p>
		<label for="animal-twitter">Twitter</label>
		<input type="text" name="animal-twitter">
	</p>
	<button type="submit">Create Animal</button>
</form>
```

If we imagine a "form" element (like the one above) as a composed
set of components, we could imagine wanting to *use* that "form"
like so:

```html
<h1>Add Animal</h1>
<FormAddAnimal
	on:submit="saveData(event)"
/>
```

So then we would *write* our "form" component like so:

```html
<!-- FormAddAnimal.html -->
<h1>Add Animal</h1>
<p>
	<label for="animal-name">Name</label>
	<input type="text" name="animal-name" bind:value="animal.name">
</p>
<p>
	<label for="animal-emoji">Emoji</label>
	<input type="text" name="animal-emoji" bind:value="animal.emoji">
</p>
<p>
	<label for="animal-email">Email</label>
	<input type="text" name="animal-email" bind:value="animal.email">
</p>
<p>
	<label for="animal-twitter">Twitter</label>
	<input type="text" name="animal-twitter" bind:value="animal.twitter">
</p>
<button on:click="create(animal)">Create Animal</button>

<script>
const emptyAnimal = () => ({
	name: '',
	emoji: '',
	email: '',
	twitter: ''
})
export default {
	data() {
		return {
			animal: emptyAnimal()
		}
	},
	methods: {
		create(animal) {
			this.fire('submit', animal)
			this.set({ animal: emptyAnimal() })
		}
	}
}
</script>
```

* We use `bind:value` so that changing the `<input>` text will
	update our bound value.
* We need to set our default values to empty strings or they
	will appear as `undefined`. (Try removing one.)
* The syntax `create(animal)` means that clicking the button
	will call the function in the `methods` object.
* The `this.fire('submit', animal)` means that the *component*
	will emit an event named `submit`, with the value being
	the bound values.
* After we fire off the event, we'll clear out the form. (The
	`emptyAnimal` is a function so that it's never modified.)

So far the `List.html` has been our root component, but we want
to start composing multiple components into an application.

Let's make an app component and add the `FormAddAnimal.html`
to it. We'll need to change the `index.html` to use the
compiled `App.js` instead of the `List.js`.

```html
<!-- App.html -->
<List animals="{{animals}}" />

<FormAddAnimal on:submit="addAnimal(event)" />

<script>
import List from './List.html'
import FormAddAnimal from './FormAddAnimal.html'

export default {
	components: {
		List,
		FormAddAnimal
	},
	methods: {
		addAnimal(animal) {
			const animals = this.get('animals')
			animals.push(animal)
			this.set({ animals })
		}
	}
}
</script>
```

* The `on:submit="addAnimal(event)"` will capture the `submit`
	event fired by the `FormAddAnimal` component, using the
	special variable name `event`.
* It calls a method `addAnimal`, which is a function defined
	in the `methods` property.

> Note: The `{ addAnimal(params) {} }` syntax is equivalent to
> the `{ addAnimal: function(params) {} }` syntax.

If you check out the [demo](./manual/2-interact/) at this point,
you can enter a name, email, twitter handle, and emoji for your
new animal. (On Mac, try the `control+command+space` shortcut to
bring up an emoji picker.)

###### 2. Section summary [demo](./manual/2-interact/)

Components can fire and handle events. This is the primary
way of passing data between components.

Methods have access to `this` and can modify the component data.

```html
<!-- Component.html -->
<button on:click="fire('something', 3)">fire</button>
<!-- Consumer.html -->
<Component on:something="stuff(event)" />
<script>
export default {
	methods: {
		stuff(number) {
			// number === 3
		}
	}
}
</script>
```
