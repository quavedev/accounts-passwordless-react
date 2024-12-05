/* global Package */

Package.describe({
  name: 'quave:accounts-passwordless-react',
  summary: 'Passwordless for React',
  version: '2.2.1',
});

Package.onUse(api => {
  api.versionsFrom('3.1');

  api.use(['accounts-base', 'accounts-passwordless'], ['client', 'server']);

  // Export Accounts (etc) to packages using this one.
  api.imply('accounts-base', ['client', 'server']);

  api.use('ecmascript');

  api.mainModule('Passwordless.js', 'client');
});
