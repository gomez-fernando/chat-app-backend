import {sortIds} from './sortIds';

describe('Given an array containing two strings', () => {
    test('should an ordered array', () => {
        const array = ['efgh', 'abcd'];
        const res = sortIds(array as [string, string]);
        expect(res).toEqual(['abcd', 'efgh'])
    });

    test('should an ordered array', () => {
        const array = ['abcd', 'efgh'];
        const res = sortIds(array as [string, string]);
        expect(res).toEqual(['abcd', 'efgh'])
    });

    test('should an ordered array', () => {
        const array = ['1abcd', '2efgh'];
        const res = sortIds(array as [string, string]);
        expect(res).toEqual(['1abcd', '2efgh'])
    });

    test('should an ordered array', () => {
        const array = ['2abcd', '1efgh'];
        const res = sortIds(array as [string, string]);
        expect(res).toEqual(['1efgh', '2abcd'])
    });
});