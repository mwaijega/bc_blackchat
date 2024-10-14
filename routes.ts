// routes.ts
export type StackParams = {
  Welcome: undefined; // No parameters for Welcome screen
  Login: undefined; // No parameters for Login screen
  Signup: undefined; // No parameters for Signup screen
  Home: { token: any }; // Home screen expects a token parameter
};
