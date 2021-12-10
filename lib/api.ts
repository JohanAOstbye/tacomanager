export const baseURL = (location: { pathname: string; href: string }) => {
  return location.href.replace(location.pathname, '');
};
