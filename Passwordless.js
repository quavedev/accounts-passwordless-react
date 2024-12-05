/* global Package */
import React, { useState } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const isEmailValid = email =>
  email &&
  email.trim() &&
  /^[A-Z0-9'.1234z_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isTokenValid = token => token && token.trim() && token.length === 6;

const defaultErrorHandler = ({ error, message }) => {
  if (Package['quave:logs']) {
    Package['quave:logs'].loggerClient.error({
      message: `accounts-passwordless-react: ${message}`,
      error,
    });
    return;
  }
  console.error(`accounts-passwordless-react: ${message}`, error);
};

const noop = () => {};

const Field = props => (
  <input
    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    {...props}
  />
);

const Label = (props = {}) => (
  <label className="block text-sm font-medium text-gray-700" {...props} />
);

const Link = props => {
  const { children } = props;
  return (
    <div className="mt-0 flex justify-end">
      <div className="text-sm">
        <a
          className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
          {...props}
        >
          {children}
        </a>
      </div>
    </div>
  );
};

const Button = props => {
  const { children } = props;
  return (
    <button
      type="submit"
      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      {...props}
    >
      {children}
    </button>
  );
};

const Message = ({ message, setMessage, isError = true }) => {
  if (!message) {
    return null;
  }
  return (
    <div className={`rounded-md ${isError ? 'bg-red-50' : 'bg-green-50'} p-4`}>
      <div className="flex">
        <div>
          <p
            className={`text-sm font-medium ${
              isError ? 'text-red-800' : 'text-green-800'
            }`}
          >
            {message}
          </p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              onClick={() => setMessage('')}
              type="button"
              className={`inline-flex ${
                isError ? 'bg-red-50' : 'bg-green-50'
              } rounded-md p-1.5 ${
                isError ? 'text-red-500' : 'text-green-500'
              } hover:${
                isError ? 'bg-red-100' : 'bg-green-100'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:${
                isError ? 'ring-offset-red-50' : 'ring-offset-green-50'
              } focus:${isError ? 'ring-red-600' : 'ring-green-600'}`}
            >
              <span className="sr-only">Dismiss</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Error = Message;
const Success = props => <Message isError={false} {...props} />;
export const Passwordless = ({
  onRequestToken = noop,
  onRequestError = defaultErrorHandler,
  onInvalidEmail = noop,
  onEnterToken = noop,
  onEnterError = defaultErrorHandler,
  onInvalidToken = noop,
  userData = {},
  inputProps = {},
  emailInputProps = {},
  tokenInputProps = {},
  twoFactorCodeInputProps = {},
  labelProps = {},
  linkProps = {},
  buttonProps = {},
  containerClassName = 'mt-8 sm:mx-auto sm:w-full sm:max-w-md',
  wrapperClassName = 'bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10',
  formClassName = 'space-y-6',
  emailLabel = 'Email address',
  tokenLabel = 'Token',
  emailLinkLabel = 'I already have a token',
  tokenLinkLabel = "I don't have a token yet",
  requestButtonLabel = 'Request Access',
  enterButtonLabel = 'Sign in',
  emailValidationErrorMessage = 'Invalid email.',
  tokenValidationErrorMessage = 'Invalid token.',
  twoFactorCodeLabel = '2FA Code',
  twoFactorCodeValidationErrorMessage = 'Invalid 2FA code.',
  getSuccessRequestTokenMessage = ({ isNewUser }) =>
    isNewUser
      ? 'Please check your email to confirm your account and get your access token.'
      : 'Welcome back. Check your email to access with your token!',
  ErrorComponent = Error,
  SuccessComponent = Success,
  extra,
}) => {
  const [isWaitingToInformToken, setIsWaitingToInformToken] = useState(false);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [needsTwoFactorCode, setNeedsTwoFactorCode] = useState(false);
  const [isCreating, setIsCreating] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successRequestTokenMessage, setSuccessRequestTokenMessage] = useState(
    ''
  );
  const askToken = e => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessRequestTokenMessage('');

    if (!isEmailValid(email)) {
      setErrorMessage(emailValidationErrorMessage);
      onInvalidEmail();
      return;
    }
    Accounts.requestLoginTokenForUser(
      {
        selector: { email },
        userData: { email, ...userData },
        options: { extra },
      },
      (error, { isNewUser } = {}) => {
        if (error) {
          onRequestError({
            error,
            message: 'Error requesting login token for user',
          });
          setEmail('');
          setToken('');
          return;
        }
        setIsWaitingToInformToken(true);
        setIsCreating(isNewUser);
        setSuccessRequestTokenMessage(
          getSuccessRequestTokenMessage({ isNewUser })
        );
        onRequestToken({ isNewUser });
      }
    );
  };
  const enterToken = e => {
    e.preventDefault();

    setErrorMessage('');
    setSuccessRequestTokenMessage('');

    if (!isEmailValid(email)) {
      setErrorMessage(emailValidationErrorMessage);
      onInvalidEmail();
      return;
    }
    if (!isTokenValid(token)) {
      setErrorMessage(tokenValidationErrorMessage);
      onInvalidToken();
      return;
    }

    if (needsTwoFactorCode) {
      Meteor.passwordlessLoginWithTokenAnd2faCode({ email }, token, twoFactorCode, error => {
        if (error) {
          onEnterError({
            error,
            message: 'Error entering 2FA code',
          });
          setErrorMessage(twoFactorCodeValidationErrorMessage);
          setTwoFactorCode('');
          return;
        }
        onEnterToken({ isNewUser: isCreating });
      });
      return;
    }

    Meteor.passwordlessLoginWithToken({ email }, token, error => {
      if (error) {
        if (error.error === 'no-2fa-code') {
          setNeedsTwoFactorCode(true);
          return;
        }
        onEnterError({
          error,
          message: 'Error entering login token',
        });
        setErrorMessage("Your token doesn't match. Please try again.");
        setToken('');
        return;
      }
      onEnterToken({ isNewUser: isCreating });
    });
  };

  const onSubmit = isWaitingToInformToken ? enterToken : askToken;
  return (
    <div className={containerClassName}>
      <div className={wrapperClassName}>
        <form className={formClassName} onSubmit={onSubmit}>
          <div>
            <Label htmlFor="email" {...labelProps}>
              {emailLabel}
            </Label>
            <div className="mt-1">
              <Field
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={({ target: { value } }) => setEmail(value)}
                {...inputProps}
                {...emailInputProps}
              />
            </div>
          </div>

          {isWaitingToInformToken && (
            <div>
              <Label htmlFor="token" {...labelProps}>
                {tokenLabel}
              </Label>
              <div className="mt-1">
                <Field
                  id="token"
                  name="token"
                  autoComplete="off"
                  required
                  value={token}
                  onChange={({ target: { value } }) => setToken(value)}
                  {...inputProps}
                  {...tokenInputProps}
                />
              </div>
            </div>
          )}

          {needsTwoFactorCode && (
            <div>
              <Label htmlFor="twoFactorCode" {...labelProps}>
                {twoFactorCodeLabel}
              </Label>
              <div className="mt-1">
                <Field
                  id="twoFactorCode"
                  name="twoFactorCode"
                  autoComplete="off"
                  required
                  value={twoFactorCode}
                  onChange={({ target: { value } }) => setTwoFactorCode(value)}
                  {...inputProps}
                  {...twoFactorCodeInputProps}
                />
              </div>
            </div>
          )}

          {ErrorComponent && (
            <ErrorComponent
              message={errorMessage}
              setMessage={setErrorMessage}
            />
          )}

          {SuccessComponent && (
            <SuccessComponent
              message={successRequestTokenMessage}
              setMessage={setSuccessRequestTokenMessage}
            />
          )}

          <div>
            {isWaitingToInformToken ? (
              <Button {...buttonProps}>{enterButtonLabel}</Button>
            ) : (
              <Button {...buttonProps}>{requestButtonLabel}</Button>
            )}
          </div>

          {isWaitingToInformToken ? (
            <Link
              onClick={() => {
                setIsWaitingToInformToken(false);
                setErrorMessage('');
                setSuccessRequestTokenMessage('');
              }}
              {...linkProps}
            >
              {tokenLinkLabel}
            </Link>
          ) : (
            <Link
              onClick={() => {
                setIsWaitingToInformToken(true);
                setErrorMessage('');
                setSuccessRequestTokenMessage('');
              }}
              {...linkProps}
            >
              {emailLinkLabel}
            </Link>
          )}
        </form>
      </div>
    </div>
  );
};
