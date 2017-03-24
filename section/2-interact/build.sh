#!/bin/bash

svelte compile --format iife AddAnimal.html > AddAnimal.js
svelte compile --format iife ListEntry.html > ListEntry.js
svelte compile --format iife List.html > List.js
