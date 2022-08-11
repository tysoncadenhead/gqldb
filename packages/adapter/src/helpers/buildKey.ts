import Mustache from 'mustache';

export const buildKey = (key: string, input) => Mustache.render(key, input);
