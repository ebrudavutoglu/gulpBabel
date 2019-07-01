# gulpBabel

### Npm and Gulp install

`npm install --global gulp-cli` <br/>

`npx mkdirp my-project` <br/>

`cd my-project`<br/>

`npm init` <br/>

`npm install --save-dev gulp`<br/>

### Babel

*Babel 7* <br/>

`npm install --save-dev gulp-babel@next @babel/core` <br/>

Create gulpfile.babel.js in your project folder <br/>

```
import gulp from 'gulp';
import babel from 'gulp-babel';

export const dev = () => {
    return gulp.src('src/**/*.js')
      .pipe(babel())
      .pipe(gulp.dest('dist'));
  }

  export default dev;

``` 

<br/>


Babel install <br/>

`npm install @babel/preset-env --save-dev` <br/>

`npm install @babel/core @babel/register --save-dev` <br/>

Create .babelrc configuration file in your project <br/>

In order to enable the preset you have to define it in your .babelrc file, like this: <br/>
```
{
  "presets": ["@babel/preset-env"]
}
```