const checkTokenExpired = (errors: Array<any>) => {
  const errorsMapping = errors?.map(
    error => error.details?.system || error.details?.base
  );

  const errorsCode = errorsMapping && errorsMapping[0] && errorsMapping[0][0];

  return {
    isAccessToken: errorsCode && errorsCode?.code === 1400,
    isSessionToken: errorsCode && errorsCode?.code === 1000
  };
};

export default checkTokenExpired;
