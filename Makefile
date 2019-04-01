install:
	npm install

start:
	npx webpack-dev-server --open

build:
	rm -rf dist
	NODE_ENV=production npx webpack

publish:
	npm publish

lint:
	npx eslint .