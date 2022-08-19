import {ISchemaJson} from '../types';

export const getModels = (json: ISchemaJson) => {
  return Object.keys(json).reduce((prev, current) => {
    if (!json[current].directives?.model) {
      return prev;
    }

    return {
      ...prev,
      [current]: json[current],
    };
  }, {} as ISchemaJson);
};
