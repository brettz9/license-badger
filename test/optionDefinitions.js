import {expect} from 'chai';
import {
  getBracketedChalkTemplateEscape
} from '../src/optionDefinitions.js';

describe('getBracketedChalkTemplateEscape', function () {
  it('Escapes brackets and backslashes', function () {
    const expected = String.raw`{ab\\u005ccd\\u007befg\\u007dhij}`;
    const escaped = getBracketedChalkTemplateEscape(
      String.raw`ab\cd{efg}hij`
    );
    expect(escaped).to.equal(expected);
  });
});
