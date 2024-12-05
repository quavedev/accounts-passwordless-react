# quave:accounts-passwordless-react

`quave:accounts-passwordless-react` is a Meteor package that provides a plug-and-play Passwordless authentication system.

## Why

It is designed to simplify the process of adding a password less authentication to Meteor apps.

We are using the `accounts-passwordless` package from Meteor.

We believe we are not reinventing the wheel in this package but what we are doing is like putting together the wheels in the vehicle :).

## Installation

```sh
meteor add quave:accounts-passwordless-react
```

## Usage

You need to add the `Passwordless` component to the route where you want to expose the form to login with the token.

The only required property is `onEnterToken` as you need to send the user to a different location or update the UI after the authentication is done.

```jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Passwordless } from 'meteor/quave:accounts-passwordless-react';

export const Access = () => {
  const history = useHistory();

  const onEnterToken = () => {
    history.push('/');
    openAlert('Welcome!');
  };
  
  return (
    <Passwordless
      onEnterToken={onEnterToken}
    />
  );
};
```

### Tailwind

By default, we provide [tailwindcss](https://tailwindcss.com/) classes, you should include `safelist` property in your `tailwind.config.js`

```js
  safelist: [
    '-mx-1.5',
    '-my-1.5',
    'appearance-none',
    'bg-green-100',
    'bg-green-50',
    'bg-indigo-600',
    'bg-red-50',
    'bg-white',
    'block',
    'border',
    'border-gray-300',
    'border-transparent',
    'cursor-pointer',
    'flex',
    'focus:border-indigo-500',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-indigo-500',
    'focus:ring-offset-2',
    'focus:ring-offset-red-50',
    'focus:ring-red-600',
    'font-medium',
    'hover:bg-indigo-700',
    'hover:bg-red-100',
    'hover:text-indigo-500',
    'inline-flex',
    'justify-center',
    'justify-end',
    'ml-auto',
    'mt-0',
    'mt-1',
    'mt-8',
    'p-1.5',
    'p-4',
    'pl-3',
    'placeholder-gray-400',
    'px-3',
    'px-4',
    'py-2',
    'py-8',
    'ring-green-600',
    'ring-offset-green-50',
    'rounded-md',
    'shadow',
    'shadow-sm',
    'sm:max-w-md',
    'sm:mx-auto',
    'sm:px-10',
    'sm:rounded-lg',
    'sm:text-sm',
    'sm:w-full',
    'space-y-6',
    'sr-only',
    'text-gray-700',
    'text-green-500',
    'text-green-800',
    'text-indigo-600',
    'text-red-500',
    'text-red-800',
    'text-sm',
    'text-white',
    'w-full',
  ],
```

or this comment somewhere in your code to avoid purging these classes:

```js
// classnames tailwind passwordless:
// appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-sm font-medium text-gray-700 mt-0 flex justify-end text-indigo-600 hover:text-indigo-500 cursor-pointer justify-center px-4 border-transparent text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-offset-2 bg-red-50 bg-green-50 p-4 text-red-800 text-green-800 ml-auto pl-3 -mx-1.5 -my-1.5 inline-flex p-1.5 text-red-500 text-green-500 hover:bg-red-100 bg-green-100 focus:ring-offset-red-50 ring-offset-green-50 focus:ring-red-600 ring-green-600 sr-only mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 shadow sm:rounded-lg sm:px-10 space-y-6 mt-1
```

### Additional options

You can customize all the texts, for example, if you have a system with multiple languages you could have a `getText` function as a helper to get the proper text based on the language.

```jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Passwordless } from 'meteor/quave:accounts-passwordless-react';
import { getText } from '../../infra/texts';

export const Access = () => {
  const history = useHistory();

  const onEnterToken = () => {
    history.push(RoutePaths.HOME);
    openAlert('Welcome!');
  };
  
  return (
    <Passwordless
      onEnterToken={onEnterToken}
      extra={{ language }}
      emailLabel={getText('emailLabel')}
      tokenLabel={getText('tokenLabel')}
      emailLinkLabel={getText('emailLinkLabel')}
      tokenLinkLabel={getText('tokenLinkLabel')}
      requestButtonLabel={getText('requestButtonLabel')}
      enterButtonLabel={getText('enterButtonLabel')}
      emailValidationErrorMessage={getText('emailValidationErrorMessage')}
      tokenValidationErrorMessage={getText('tokenValidationErrorMessage')}
      twoFactorCodeLabel={getText('twoFactorCodeLabel')}
      twoFactorCodeValidationErrorMessage={getText('twoFactorCodeValidationErrorMessage')}
      getSuccessRequestTokenMessage={({ isNewUser }) =>
        getText('successRequestTokenMessage', { isNewUser })
      }
    />
  );
};
```

We do support even more options, you can see all of them in the [code](https://github.com/quavedev/accounts-passwordless-react/blob/main/Passwordless.js#L108).

By default TailwindCSS classes are added for you but you can override them. You can set up TailwindCSS as in this [example](https://github.com/meteor/examples/tree/main/tailwindcss).

#### UI props

```javascript
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
```

#### Event Handlers props
```javascript
  onRequestToken = noop,
  onRequestError = defaultErrorHandler,
  onInvalidEmail = noop,
  onEnterToken = noop,
  onEnterError = defaultErrorHandler,
  onInvalidToken = noop,
```

#### Accounts data props
```javascript
  userData = {}, // will be merged with the user data when a new user is created
  extra, // will be send in the Accounts.requestLoginTokenForUser call as option
```

#### Components props
```javascript
  ErrorComponent = Error,
  SuccessComponent = Success,
```

If you don't want to use this UI to display messages you can provide `null` for both.

### Two-Factor Authentication (2FA)

This package supports Two-Factor Authentication (2FA) when used with the `accounts-2fa` package. When 2FA is enabled for a user, they will be prompted to enter their 2FA code after successfully entering their email and token.

The flow works as follows:
1. User enters their email and receives a token
2. User enters the token
3. If 2FA is enabled for the user, a new field appears requesting their 2FA code
4. User enters the code from their authenticator app
5. Authentication completes if the code is valid

Example with 2FA handling:

```jsx
import React from 'react';
import { useHistory } from 'react-router-dom';
import { Passwordless } from 'meteor/quave:accounts-passwordless-react';

export const Access = () => {
  const history = useHistory();

  const onEnterToken = () => {
    history.push('/');
    openAlert('Welcome!');
  };
  
  return (
    <Passwordless
      onEnterToken={onEnterToken}
      twoFactorCodeLabel="Enter your 2FA code"
      twoFactorCodeValidationErrorMessage="Invalid 2FA code"
    />
  );
};
```

#### Additional 2FA Props
```javascript
  twoFactorCodeLabel = '2FA Code', // Label for the 2FA code input field
  twoFactorCodeValidationErrorMessage = 'Invalid 2FA code.', // Error message for invalid 2FA code
  twoFactorCodeInputProps = {}, // Additional props to be passed to the 2FA code input field
```

### License

MIT

