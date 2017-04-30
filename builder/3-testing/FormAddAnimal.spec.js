const test = require('tape')
const FormAddAnimal = require('./FormAddAnimal.html')

test('creating the component does not throw error', t => {
	const component = new FormAddAnimal()
	t.end()
})

test('modified input values in fired event', t => {
	// attach the component to <body>
	const component = new FormAddAnimal({
		target: window.document.querySelector('body'),
		// set the form values
		data: {
			animal: {
				name: 'Bob',
				emoji: '🦄'
			}
		}
	})

	// test the value of the fired event
	component.on('submit', animal => {
		t.equal(animal.name, 'Bob', 'name should be emitted')
		t.equal(animal.emoji, '🦄', 'emoji should be emitted')
		t.notOk(animal.email, 'email should not exist')
		t.notOk(animal.twitter, 'twitter should not exist')
		// complete the test
		t.end()
	})

	// simulate clicking the button
	const click = new window.MouseEvent('click')
	window.document.querySelector('button').dispatchEvent(click)
})
