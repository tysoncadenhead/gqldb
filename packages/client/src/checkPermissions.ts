const defaultAuthenticationFn = (_permissions: string[], _ctx) => {
  return true;
};

export const checkPermissions = (
  permissions: string[],
  ctx,
  customAuthenticationFn,
) => {
  const authenticationFn = customAuthenticationFn || defaultAuthenticationFn;
  if (!authenticationFn(permissions, ctx)) {
    throw new Error('Unauthorized');
  }
};
