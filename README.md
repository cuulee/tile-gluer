TileGluer
=========

Installation
------------

Tested on Ubuntu 14.04.

Install latest node.js:

    sudo apt-get install curl
    curl -sL https://deb.nodesource.com/setup | sudo bash -
    sudo apt-get install nodejs
    node -v
    npm -v

Install GraphicsMagick

See http://www.graphicsmagick.org/README.html

Clone this repo:

    sudo apt-get install git
    git clone https://github.com/geostarters/tile-gluer.git

Install its dependencies with npm:

    cd tile-gluer
    npm install


For an usage message, run without parameters o with help:

    node tileGluer
    node tileGluer help

## Examples
    node tileGluer V images_in/ images_out/ ppp_TN_x{x}y{y}.png output_{x}.png 3 9

    node tileGluer V images_in/ images_out/ ppp_TN_x{x}y{y}.png output_{x}.png 3 25 6 16 0

    node tileGluer H images_out/ images_out/ output_{x}.png output_final_{x}.png 3 6

    node tileGluer H images_out/ images_out/ output_final_{x}.png output_total_{x}.png 2 2
