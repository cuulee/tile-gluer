#!/usr/bin/env node
'use strict';

var gm = require('gm');
var template = require("string-template");

var argv = process.argv;

var tileGluer = {
  mosaicVertical: function(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup){
    var self = this;
    console.time("timeTotal");
    var image = self.images_path_in + template(self.images_in_name, {x: ngroup, y: tilecount});
    self.getImageSize(image, function(err, size){
      var tileSize = size.height;
      self.generateMosaicV(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize);
    });
  },
  generateMosaicV: function(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize){
    var self = this;
    var ypos = 0;
    console.time("timeImage");
    var maxY = (max_tiles-1)*tileSize;
    for(var y = tilecount; y < max_tiles; y++){
      var image_name = template(self.images_in_name, {x: ngroup, y: y});
      console.log(image_name);
      ypos = maxY-(y*tileSize);
      imgTmp.in('-page', '+'+0+'+'+ypos).in(self.images_path_in + image_name);
    }
    console.log(template(self.images_out_name, {x: ngroup, y: y}));
    imgTmp.mosaic()  // Merges the images as a matrix
      .write(self.images_path_out+template(self.images_out_name, {x: ngroup, y: y}), function (err) {
          if (err) console.log(err);
          console.timeEnd("timeImage");
          ngroup = ngroup+1;
          if(ngroup < max_group){
            self.generateMosaicV(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize);
          }else{
            console.timeEnd("timeTotal");
          }
      });
  },
  mosaicHoritzontal: function(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup){
    var self = this;
    console.time("timeTotal");
    var image = self.images_path_in + template(self.images_in_name, {x: tilecount, y: ngroup});
    self.getImageSize(image, function(err, size){
      var tileSize = size.width;
      self.generateMosaicH(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize);
    });
  },
  generateMosaicH: function(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize){
    var self = this;
    console.time("timeImage");
    var inicio = tilecount;
    var pos = 0;
    var limit = inicio+num_tiles_group;
    if(limit > max_tiles){
      limit = max_tiles;
    }
    for(var x = inicio; x < limit; x++){
      console.log(template(self.images_in_name, {x: x, y: ngroup}));
      tilecount++;
      imgTmp.in('-page', '+'+pos*tileSize+'+'+0).in(self.images_path_in + template(self.images_in_name, {x: x, y: ngroup}));
      pos++;
    }
    console.log(template(self.images_out_name, {x: ngroup, y: ngroup}));
    imgTmp.mosaic()  // Merges the images as a matrix
      .write(self.images_path_out+template(self.images_out_name, {x: ngroup, y: ngroup}), function (err) {
        if (err) console.log(err);
        console.timeEnd("timeImage");
        if(tilecount < max_group){
          ngroup++;
          self.generateMosaicH(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup, tileSize);
        }else{
          console.timeEnd("timeTotal");
        }
    });
  },
  init: function(images_path_in, images_path_out, images_in_name, images_out_name){
    this.images_path_in = images_path_in;
    this.images_path_out = images_path_out;
    this.images_in_name = images_in_name;
    this.images_out_name = images_out_name;
  },
  getImageSize: function(image, callback){
    gm(image).size(function (err, size) {
      if (err){
        console.log(err);
        callback(err, image);
      }
      if (!err) {
        callback(null, size);
      }
    });
  }
};

if (require.main === module) {
  if(argv[2] === "help" || argv.length < 9){
    var command = require('path').basename(argv[1]);
    console.log('\nUsage: %s direction src_folder dst_folder images_in_name images_out_name num_tiles_group max_tiles [max_group [tilecount [ngroup]]] \n', command);
    console.log('   direction: mosaic direction options V or H.');
    console.log('   src_folder: folder with the source images.');
    console.log('   dst_folder: mosaic destination folder.');
    console.log('   images_in_name: prefix name of the input images.');
    console.log('   images_out_name: prefix name of the output images.');
    console.log('   num_tiles_group: number of tiles in the image.');
    console.log('   max_tiles: maximum number of tiles.');
    console.log('   max_group: (optional) maximum number of groups.');
    console.log('   tilecount: (optional) number of start tile.');
    console.log('   ngroup: (optional) group number.\n');
  }else{
    var direction = argv[2];
    var src_folder = argv[3];
    var dst_folder = argv[4];
    var images_in_name = argv[5];
    var images_out_name = argv[6];
    var num_tiles_group = parseInt(argv[7]);
    var max_tiles = parseInt(argv[8]);
    var max_group = argv[9] || max_tiles;
    max_group = parseInt(max_group);
    var tilecount = argv[10] || 0;
    tilecount = parseInt(tilecount);
    var ngroup = argv[11] || 0;
    ngroup = parseInt(ngroup);
    var imgTmp = gm();
    tileGluer.init(src_folder, dst_folder, images_in_name, images_out_name);
    if(direction === 'V'){
      tileGluer.mosaicVertical(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup);
    }else{
      tileGluer.mosaicHoritzontal(imgTmp, num_tiles_group, max_tiles, max_group, tilecount, ngroup);
    }
  }
}else {
  console.log("module");
  // Use as a module
  module.exports = tileGluer;
}
