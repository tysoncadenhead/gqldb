export const getArguments = <I>(a, b): I => {
  return a?.context?.arguments?.input || b?.input;
};
