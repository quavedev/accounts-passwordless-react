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

### License

MIT

