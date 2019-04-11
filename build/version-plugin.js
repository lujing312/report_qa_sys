var fs = require('fs-extra'),
  path = require('path'),
  rVerFilename = /([^@]*)@([^\.]*)(\.js|\.css)/;

var generateVersionPlugin = function() {
  this.verPath = path.join(process.cwd(), 'ver');
};

generateVersionPlugin.prototype.apply = function(compiler) {
  var self = this;
  compiler.plugin('done', function(stats) {
    fs.ensureDirSync(self.verPath);
    fs.emptyDirSync(self.verPath);

    var json = stats.toJson();
    var files = json.assets;
    var all = '';
    files.forEach(function(file) {
      var fullname = file.name; // eg:index@4c7eb2ee813e1eaf4cd3.js.map
      var matches = fullname.match(rVerFilename);
      if (matches) {
        var name = matches[1] + matches[3];
        all += name + '#' + matches[2] + '\n';
        fs.outputFileSync(path.join(self.verPath, name + '.ver'), matches[2]);
      }
    });
    all = all.substring(0, all.length - 1);
    fs.outputFileSync(path.join(self.verPath, 'versions.mapping'), all);
  });
};

module.exports = generateVersionPlugin;
