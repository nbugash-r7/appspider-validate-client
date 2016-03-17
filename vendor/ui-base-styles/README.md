# Rapid7 Base Styles

## Importing the styles

### Bower

These styles are available via [Bower](http://bower.io).

```console
$ bower install git@github-r7:rapid7/ui-base-styles.git
```

**NB:** Replace `github-r7` with `github.com` if you're only using one SSH key.

## Using The base styles

When using the base styles you can reference the main scss file and complie the base styles as part of your project.

```
@import 'bower_components/ui-base-styles/app/styles/main.scss'
```

## Building

To complie the base styles run `npm run build`

## Theming

A [rudimentary demonstration of theming can be found here.](https://github.com/rapid7/ui-base-styles/blob/master/public/main.scss#L9-L16). Here's [an example of a theme file](https://github.com/rapid7/ui-base-styles/blob/master/public/styles/themes/_dark.scss).

For an idea of what's possible to theme just by changing variables, check out [`_variables.css`](https://github.com/rapid7/ui-base-styles/blob/master/bower_components/bootstrap-sass/assets/stylesheets/bootstrap/_variables.scss).
