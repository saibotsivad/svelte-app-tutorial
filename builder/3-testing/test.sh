#!/bin/bash

browserify -t [ sveltify ] FormAddAnimal.spec.js | tape-run
