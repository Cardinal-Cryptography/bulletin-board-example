type ParsedDataType<T> = { Ok: T };

export const getDataFromOutput = <T>(data: unknown | ParsedDataType<T>) =>
  (data as ParsedDataType<T>)?.Ok as T;
