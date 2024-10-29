[Trello link](https://trello.com/c/Tl8jwWLo/1-crear-estructura-b%C3%A1sica-expressjs)

## Description

Refactored the user authentication module to improve performance and reduce memory usage.

## Changelog

- Refactored authentication logic to use async/await.
- Removed deprecated `crypto` module functions.
- Added new unit tests for edge cases in the login flow.

## Notes

- Ensure to run `npm install` after merging as there are new dependencies.
- The refactor does not affect the existing database schema.

## Showcase

![login-flow](https://user-images.githubusercontent.com/example.gif)
