import { useEffect } from 'react';
import { UseFormSetError } from 'react-hook-form';

interface ErrorSlateProps {
  /** error destructured from react-query, structure refer to: TError */
  error?: any;
  /** string or flat string array, for manual validation */
  errorMessages?: string | string[];
  /** setError destructured from the react for hook: useForm */
  setError?: UseFormSetError<any>;

  rightAlign?: boolean;
}

/** handling server side validation */
const ErrorSlate = (props: ErrorSlateProps) => {
  const { error, errorMessages, setError, rightAlign } = props;

  useEffect(() => {
    if (setError && error && error.validationError) {
      Object.entries(error.validationError).forEach(([key, value]) => {
        setError(key, { message: Array.isArray(value) ? value.join(' ') : String(value) }, { shouldFocus: true });
      });
    }
  }, [error, setError]);

  // convert error messages to string array or undefined
  const errorMsgs =
    errorMessages && errorMessages !== ''
      ? typeof errorMessages === 'string'
        ? [errorMessages]
        : errorMessages
      : undefined;

  return (
    <>
      {error && <p className={'text-danger' + (rightAlign ? ' text-end' : '')}>{error.message}</p>}
      {errorMsgs &&
        errorMsgs.map((msg, index) => (
          <p key={index} className={'text-danger' + (rightAlign ? ' text-end' : '')}>
            {msg}
          </p>
        ))}
    </>
  );
};

export default ErrorSlate;
