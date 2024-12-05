## Changelog

### 2.2.1

- Added support for Two-Factor Authentication (2FA) in the passwordless login form
- Added new customizable props for 2FA:
  - `twoFactorCodeLabel`: Customize the 2FA input field label
  - `twoFactorCodeValidationErrorMessage`: Customize the 2FA validation error message
  - `twoFactorCodeInputProps`: Additional props for the 2FA input field
- Automatically handles the `no-2fa-code` error and shows 2FA input when required
- Compatible with the `accounts-2fa` package

### 2.1.0

- Work with Meteor 3

### 2.0.0

- This version is compatible with Meteor 2.5.1+
  - Upgrade to fix breaking change from Meteor 2.5.1 (accounts-passwordless 2.0.0)

### 1.0.0
- This version is compatible with Meteor 2.5 only
