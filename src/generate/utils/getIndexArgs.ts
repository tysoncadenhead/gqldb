import {ISelectors, IIndex} from '../../types';
import {parseKeyArgs} from './getKeyArgs';

export const getIndexArgs = (
  current: string,
  index: IIndex,
  selectors: ISelectors,
) => {
  const pkIndex = selectors[current].keys.find((key) => key.key === index.pk);
  const skIndex = selectors[current].keys.find((key) => key.key === index.sk);
  const pkArgs = parseKeyArgs(pkIndex.value);
  const skArgs = parseKeyArgs(skIndex.value);
  const args = [...pkArgs, ...skArgs];

  return args;
};
