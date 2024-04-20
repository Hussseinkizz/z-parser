import { Parser } from './jsx.parser.js';
import { Tokenizer } from './jsx.tokenizer.js';

export const jsx = (input, opts = {}) => Parser(Tokenizer(input), opts);
