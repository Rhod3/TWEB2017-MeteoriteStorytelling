function transformData() {
    fs = require('fs');
    fs.readFile('docs/datasets/earthMeteoriteLandings.json', function (err,data) {
      if (err) {
        return console.log(err);
      }
      console.log(data);
    });
}

transformData();