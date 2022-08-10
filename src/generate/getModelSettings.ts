import {IModels, IOptions, IModelSettings} from '../types';

export const getModelSettings = (
  models: IModels,
  options: IOptions,
): IModelSettings => {
  return Object.keys(models).reduce((prev, current) => {
    const directive = models[current].astNode.directives.find(
      (directive) => directive.name.value === 'model',
    );
    const tableName =
      directive.arguments.find((arg) => arg.name.value === 'table')?.value
        ?.value || options?.tableName;

    if (!tableName) {
      throw new Error(`No tableName found for ${current}`);
    }

    return {
      ...prev,
      [current]: {
        tableName,
      },
    };
  }, {} as IModelSettings);
};
