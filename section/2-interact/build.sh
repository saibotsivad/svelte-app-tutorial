#!/bin/bash

svelte compile --format iife FormAddAnimal.html > FormAddAnimal.js
svelte compile --format iife ListEntry.html > ListEntry.js
svelte compile --format iife List.html > List.js
