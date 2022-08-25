import {checkPermissions} from './checkPermissions';
import {getArguments} from './getArguments';
import {getContext} from './getContext';

export const wrapResolver =
  (resolverOptions) =>
  <I>(name: string, permissions: string[], fn) =>
  async (a, b) => {
    const inputArgs = getArguments<I>(a, b);
    const inputCtx = getContext(a);
    const beforeInput = {ctx: inputCtx, args: inputArgs};

    const {ctx, args} = resolverOptions?.hooks?.before
      ? await resolverOptions?.hooks?.before(name, beforeInput)
      : beforeInput;

    checkPermissions(permissions, ctx, resolverOptions?.checkPermissions);

    const result = await fn({
      args,
      ctx,
    });

    if (resolverOptions?.hooks?.after) {
      return await resolverOptions.hooks.after(name, result);
    }

    return result;
  };
