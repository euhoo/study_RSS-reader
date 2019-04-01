npm install webpack webpack-cli --save-dev //скачиваем сам вебпак
https://webpack.js.org/guides/getting-started/

npm install --save-dev style-loader css-loader  // плагины для добавления css  в сборку
https://webpack.js.org/guides/asset-management
// style-loader конфликтует с mini-css-exrtact-plugin. используем или то или то

npm install --save-dev mini-css-extract-plugin  // плагин для добавления css файлов в dist
https://github.com/webpack-contrib/mini-css-extract-plugin

npm install --save-dev clean-webpack-plugin     // плагин для очистки в dist перед сборкой
https://github.com/johnagan/clean-webpack-plugin

npm i jquery popper.js --save // ставим пакеты jquery и poper.js
//чтобы потом поставить bootstrap

npm install bootstrap --save // ставим  bootstrap
https://www.youtube.com/watch?v=YnYmdnAx5ZQ&index=8&list=PLficgFmiYCC-LyxKaTT7DdorqebE95LYG
https://getbootstrap.com/


https://getbootstrap.com/docs/4.1/getting-started/webpack/

npm install sass-loader node-sass --save-dev
//подключаем sass для bootstrap

npm install optimize-css-assets-webpack-plugin --save-dev //оптимизируем css
https://www.npmjs.com/package/optimize-css-assets-webpack-plugin
