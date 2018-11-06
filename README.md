![arworldtravels-brand](brand/arworldtravels-brand.svg)

My girlfriend originally built a travel "blog" with [Wix](https://www.wix.com/) to keep some family and friends updated while we were doing some long-term traveling. It worked fine and was easy to update along the way. However, to connect a custom domain to the site we had to pay for a premium plan. I thought it would be nice to keep the site up and running even after our trip was over but didn't want to keep paying for the premium plan. So I saw this as an opportunity to try and re-build the site manually and host it for free (the Wix site was also bloated and ran slow on bad networks).

## Tech Stack

* [Hugo](http://gohugo.io/)
* [Bootstrap](http://getbootstrap.com/)
* [Primer](https://primer.github.io/) (only [primer-markdown](https://github.com/primer/primer/tree/master/modules/primer-markdown))

<a href="https://www.netlify.com" target="_blank"><img src="https://www.netlify.com/img/global/badges/netlify-color-accent.svg"/></a>

## Development Tools

* [Gulp](https://gulpjs.com/)
* [Webpack](https://webpack.js.org/)
* [Babel](https://babeljs.io/)
* [Sass](http://sass-lang.com/)
* [Yarn](https://yarnpkg.com/en/)

## Favicon

Generated with [https://realfavicongenerator.net/](https://realfavicongenerator.net/).

## Local Development

Install [Hugo](https://gohugo.io/getting-started/installing).

Install [Node.js](https://nodejs.org) and [Yarn](https://yarnpkg.com/en/docs/install).

Install dependencies:

```sh
yarn install
```

Install `gulp-cli` globally to run tasks:

```sh
yarn global add gulp-cli

# Build site and start a dev server. Outputs to dev/
gulp server

# Run production build. Outputs to dist/
gulp deploy
```
