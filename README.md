## Table of Contents
- [Local Environment Setup](#local-environment-setup)
  [Some application Logic](#app-logic)
- [Available Scripts](#available-scripts)
  - [npm start](#npm-start)
  - [npm run build](#npm-run-build)

## Local Environment Setup

To get a local development environment up and running, you'll need a copy of this repo running as well as https://github.com/team-clarify/clarify_backend at port 8000 (the default port). Head over to that repo for details on how to pull that down.

## Commit messages
Commit messages should be written in the imperative, sentance form. This makes the git history a list of statements of work that are easy to scan. E.g. "Change the base font size to 14px" is preferable to "base font changes". Include as many details as possible while maintaining a 50 character limit. This allows commit messages to display in most editors. If you can't limit yourself to 50 characters, that's a good indication that your commit is doing too much. Consider breaking it up into a few different commits each responsible for their own pieces of functionality.


## Branches and Pull Requests
Resist the urge to push directly to the `master` branch. For most organization members this functionality is disabled to encourage pull request-based review and development. PR's should be opened early and often during a workflow. Think of them as works in progress, even if there's only a skeleton initial commit. Tag or assign the PR to the relevent parties and use the description as a statement of intended work. That way the commits reflect the evolution of that work and tagged team members can validate or redirect as it progresses.


## App Logic
A report's query is often used as an identifier in place of a report_id since we can have a report response without having saved it. That, and report_query's are unique to a user, so a user should never have conflicts within their list of reports.

Because of this we need a reliable way to generate the same string for a given set of query parameters. If we just throw them together in any order, then reports that look like
-`?group=student&group_id=8221&type=grades&from_date=2017-08-01`
-`?group_id=8221&group=student&type=grades&from_date=2017-08-01`
will be seen as different, even when we have their report in the browser cache, in the database, in reporting, etc.

For this purpose, the frontend uses a function in the utils.js file to deterministically generate a report query based on query parameters passed to that function. It is important that that function be kept up to date with the same function being used in the backend (as yet, none...). Eventually this could be broken out into its own service that the FE and BE could consume independently but that seems like crazy overkill right now. For now, just be aware.



## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!