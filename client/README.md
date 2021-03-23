# Frontend

## How to set up your project?

-   Install node js
-   Install npm version 6 `npm install -g npm@6.14.11`
-   Follow the workflow for this project (Fork, run `npm install` in client folder and finally `npm start`)

Please refer to the [Environment Setup](https://github.com/SE701Group2/daily-focus/wiki/Environment-setup) Link in Wiki for more information

## High-level architecture

FOCUS is built using React v16.14.0. This is used for compatibility with the Enzyme testing library

-   [Material UI](https://material-ui.com/) (core and icon) and [Font Awesome](https://fontawesome.com/) are used for the application look and feel.
-   [use-persisted-state](https://github.com/donavon/use-persisted-state) library is used to store data when an API endpoint is not yet available.

Please refer to the [Front End](https://github.com/SE701Group2/daily-focus/wiki/Front-End) under Architecture heading in the Wiki for more information about each individual components and how each of them are set up.

## Testing

For testing purposes, you are required to use npm version 6. Run `npm install -g npm@6.14.11`

Test files must be named like: `MyComponent.test.js`

`npm test .` will run all tests. Running `npm test --watch` will allow any updated test to run on save.

## Libraries Used

-   [Jest](https://jestjs.io/)
-   [Jest-Dom](https://github.com/testing-library/jest-dom) v^5.11.9
-   [Enzyme](https://enzymejs.github.io/enzyme/) v^3.11.0
    -   [Enzyme Adapter React 16](https://www.npmjs.com/package/enzyme-adapter-react-16) v^1.15.6
-   [react-test-renderer](https://www.npmjs.com/package/react-test-renderer) v^16.14.0

## Snapshot Testing

Snapshot testing is used for React Components. [See here](https://jestjs.io/docs/snapshot-testing) for info on how and why to use snapshot testing.  
`react-test-renderer` library is used. (_Note, Enzyme is not used due to a version incompatibility with Jest causing the generated snapshots to be broken. [See here.](https://stackoverflow.com/questions/54419342/jest-enzyme-shallowwrapper-is-empty-when-creating-snapshot)_)

See the [Frontend Testing](https://github.com/SE701Group2/daily-focus/wiki/Front-End-Testing) Link under Testing for example test code

## Unit Testing

`enzyme` is used for other unit tests to verify intended functionality:

See the [Frontend Testing](https://github.com/SE701Group2/daily-focus/wiki/Front-End-Testing) Link under Testing for example test code