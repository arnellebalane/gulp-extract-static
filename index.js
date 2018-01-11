const through2 = require('through2');
const vinyl = require('vinyl-fs');

module.exports = (options={}) => {
    return through2.obj(function(chunk, encoding, callback) {
        const contents = chunk.contents.toString();
        const noop = match => match;

        const pattern = options.pattern;
        const transform = options.transform || noop;
        const baseUrl = options.baseUrl;

        const matches = [];

        let match;
        while (match = pattern.exec(contents)) {
            const transformed = transform(match, options);
            if (transformed) {
                matches.push(transformed);
            }
        }

        vinyl.src(matches, {
            base: baseUrl,
            allowEmpty: true
        }).pipe(through2.obj((chunk, encoding, cb) => {
            this.push(chunk);
            cb(null);
        }, () => callback(null)));
    });
};
