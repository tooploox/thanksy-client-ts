#!/bin/sh
npx poi build --require ts-node/register --config poi.config.js
cp src/assets/cheer.mp3 dist/assets/
cp manifest.json dist/
cp favicon.png dist/
