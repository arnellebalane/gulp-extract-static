const through2 = require('through2');
const vinyl = require('vinyl-fs');

module.exports = (options={}) => {
    return through2.obj(function(chunk, encoding, callback) {
        const contents = chunk.contents.toString();

        const pattern = options.pattern;
        const transform = options.transform || match => match;
        const baseUrl = options.baseUrl;

        const matches = [];

        let match;
        while (match = pattern.exec(contents)) {
            const tranformed = transform(match, options);
            matches.push(transformed);
        }

        vinylfs.src(resources, { base: baseUrl }).pipe(through2.obj((chunk, encoding, cb) => {
            this.push(chunk);
            cb(null);
        }, () => callback(null)));
    });
};
