var fortune = require('../libs/fortune.js');
var expect = require('chai').expect;

suite('Тесты печений-предсказаний', function () {
    test('getFortune() должна возвращать предсказание', function () {
        expect(typeof fortune.getFortune() === 'string');
    });
});