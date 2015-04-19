describe('json-format', function() {

    describe('output', function() {
        it('is the same', function() {
            var output = require('../../build/json/test-no-options.json'),
                input = require('../json/test-no-options.json');

            expect(output).to.deep.equal(input);
        });

        it('has _comments removed', function() {
            var output = require('../../build/json/test-remove-comment.json'),
                input = require('../json/test-remove-comment.json');

            delete input[0]._comment;

            expect(output).to.deep.equal(input);
        });
    });

});
