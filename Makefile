install:
	npm install

start:
	npm start

build:
	rm -rf dist
	NODE_ENV=production npx webpack

publish:
	npm publish

lint:
	npx eslint .