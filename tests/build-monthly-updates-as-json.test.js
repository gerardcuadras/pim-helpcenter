const updatesAsJson = require('../tasks/build-monthly-updates-as-json.js');
const del = require('del');
const fs = require('fs');

test('Generate the json about the updates of the PIM', done => {
    del(['tmp/*']);
    const stream = updatesAsJson('./tests/updates/nominal_case/**/*.md', './tmp/', 'test.json');

    stream.on('end', () => {
        const rawData = fs.readFileSync('./tmp/test.json');
        const data = JSON.parse(rawData);

        const expectedRawData = fs.readFileSync('./tests/updates/nominal_case/expected_updates.json');
        const expectedData = JSON.parse(expectedRawData);

        try {
            expect(data.sort(sortJson)).toStrictEqual(expectedData.sort(sortJson));
            done();
        } catch (error) {
            done(error);
        }
    });
});

function sortJson(update1, update2) {
    if (update1.startDate < update2.startDate) {
        return -1;
    } else if (update1.startDate > update2.startDate) {
        return 1;
    } else if (update1.startDate === update2.startDate && update1.filename < update2.filename) {
        return -1;
    } else if (update1.startDate === update2.startDate && update1.filename === update2.filename) {
        return 0;
    } else if (update1.startDate === update2.startDate && update1.filename > update2.filename) {
        return 1;
    }
}
