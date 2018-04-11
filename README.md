## Table of Contents
- [Local Environment Setup](#local-environment-setup)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm test](#npm-test)
  - [npm run build](#npm-run-build)
  - [npm run eject](#npm-run-eject)

## Local Environment Setup

To get a local development environment up and running, you'll need a copy of this repo running as well as https://github.com/team-clarify/clarify_backend at port 8000 (the default port). Head over to that repo for details on how to pull that down.

## Commit messages
Commit messages should be written in the imperative, sentance form. This makes the git history a list of statements of work that are easy to scan. E.g. "Change the base font size to 14px" is preferable to "base font changes". Include as many details as possible while maintaining a 50 character limit. This allows commit messages to display in most editors. If you can't limit yourself to 50 characters, that's a good indication that your commit is doing too much. Consider breaking it up into a few different commits each responsible for their own pieces of functionality.


## Branches and Pull Requests
Resist the urge to push directly to the `master` branch. For most organization members this functionality is disabled to encourage pull request-based review and development. PR's should be opened early and often during a workflow. Think of them as works in progress, even if there's only a skeleton initial commit. Tag or assign the PR to the relevent parties and use the description as a statement of intended work. That way the commits reflect the evolution of that work and tagged team members can validate or redirect as it progresses. 


## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.
