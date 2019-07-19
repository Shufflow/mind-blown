// tslint:disable: no-console
let consoleError: any;
let consoleWarn: any;

export const disableConsoleError = () => {
  if (consoleError) {
    console.log('console.error is already disabled');
    return;
  }

  consoleError = console.error.bind(console);
  console.error = () => {};
};

export const enableConsoleError = () => {
  if (!consoleError) {
    console.log('console.error was not disabled');
    return;
  }

  console.error = consoleError;
  consoleError = undefined;
};

export const disableConsoleWarn = () => {
  if (consoleWarn) {
    console.log('console.warn is already disabled');
    return;
  }

  consoleWarn = console.warn.bind(console);
  console.warn = () => {};
};

export const enableConsoleWarn = () => {
  if (!consoleWarn) {
    console.log('console.warn was not disabled');
    return;
  }

  console.warn = consoleWarn;
  consoleWarn = undefined;
};

export const disableConsoleErrorAndWarn = () => {
  disableConsoleError();
  disableConsoleWarn();
};

export const enableConsoleErrorAndWarn = () => {
  enableConsoleError();
  enableConsoleWarn();
};

// tslint:enable: no-console
