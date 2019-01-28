const sleep = async (timeout: number) =>
  new Promise<void>(resolve => {
    setTimeout(resolve, timeout);
  });

export default sleep;
