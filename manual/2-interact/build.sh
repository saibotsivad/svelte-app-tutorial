#!/bin/bash

svelte compile --format iife FormAddAnimal.html > FormAddAnimal.js
svelte compile --format iife ListEntry.html > ListEntry.js
svelte compile --format iife List.html > List.js
svelte compile --format iife App.html > App.js
