# Backend and Frontend Template

Latest version: https://git.chalmers.se/courses/dit342/group-27-web

## Project Structure

| File        | Purpose           | What you do?  |
| ------------- | ------------- | ----- |
| `server/` | Backend server code | All your server code |
| [server/README.md](server/README.md) | Everything about the server | **READ ME** carefully! |
| `client/` | Frontend client code | All your client code |
| [client/README.md](client/README.md) | Everything about the client | **READ ME** carefully! |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Free online production deployment | Deploy your app online in production mode |
| [docs/LOCAL_DEPLOYMENT.md](docs/LOCAL_DEPLOYMENT.md) | Local production deployment | Deploy your app local in production mode |

## Requirements

The version numbers in brackets indicate the tested versions but feel free to use more recent versions.
You can also use alternative tools if you know how to configure them (e.g., Firefox instead of Chrome).

* [Git](https://git-scm.com/) (v2) => [installation instructions](https://www.atlassian.com/git/tutorials/install-git)
  * [Add your Git username and set your email](https://docs.gitlab.com/ce/gitlab-basics/start-using-git.html#add-your-git-username-and-set-your-email)
    * `git config --global user.name "YOUR_USERNAME"` => check `git config --global user.name`
    * `git config --global user.email "email@example.com"` => check `git config --global user.email`
  * > **Windows users**: We recommend to use the [Git Bash](https://www.atlassian.com/git/tutorials/git-bash) shell from your Git installation or the Bash shell from the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10) to run all shell commands for this project.
* [Chalmers GitLab](https://git.chalmers.se/) => Login with your **Chalmers CID** choosing "Sign in with" **Chalmers Login**. (contact [support@chalmers.se](mailto:support@chalmers.se) if you don't have one)
  * DIT342 course group: https://git.chalmers.se/courses/dit342
  * [Setup SSH key with Gitlab](https://docs.gitlab.com/ee/ssh/)
    * Create an SSH key pair `ssh-keygen -t ed25519 -C "email@example.com"` (skip if you already have one)
    * Add your public SSH key to your Gitlab profile under https://git.chalmers.se/profile/keys
    * Make sure the email you use to commit is registered under https://git.chalmers.se/profile/emails
  * Checkout the [Backend-Frontend](https://git.chalmers.se/courses/dit342/group-00-web) template `git clone git@git.chalmers.se:courses/dit342/group-00-web.git`
* [Server Requirements](./server/README.md#Requirements)
* [Client Requirements](./client/README.md#Requirements)

## Getting started

```bash
# Clone repository
git clone git@git.chalmers.se:courses/dit342/group-27-web.git

# Change into the directory
cd group-27-web

# Setup backend
cd server && npm install
npm run dev

# Setup frontend
cd client && npm install
npm run serve
```

> Check out the detailed instructions for [backend](./server/README.md) and [frontend](./client/README.md).

## Visual Studio Code (VSCode)

Open the `server` and `client` in separate VSCode workspaces or open the combined [backend-frontend.code-workspace](./backend-frontend.code-workspace). Otherwise, workspace-specific settings don't work properly.

## System Definition (MS0)

### Purpose

Questy is a platform where the users can interact with each other by particularly reviewing games and having discussions in the comment section. Users can comment and give their opinion whether they agree, disagree, or feel neutral with the review. There is an administrator role for certain users to moderate content on the website, which other users can then interact with.

### Pages

* Login: This page displays a field where the user can enter their credentials to *log in*. They are also given the option to *sign up* if they do not yet have an account.

* Home: This page shows a selection of *games, reviews, and most recent activity from users they follow*. The user can select certain elements to be redirected to the relevant page.

* All-Games: This page displays *all existent games on the website*. The user can filter the displayed games by name or tags. For each listed game there is a 'more' button the user can press to be redirected to the corresponding game page.

* Game: This page will display *all the information about a specific game* (such as its name, release date, and tags) and the reviews it has received by users. The user can create a new review, delete or edit the game they are currently viewing.

* Add-Game: This page allows an admin to *post a new game to the website*. They enter the following properties: name, author, release date and pick from pre-selected tags.

* Profile: This page displays *the specific user’s profile* along with their bio, people they follow, and their reviews. Each user has their own profile page and other users can follow them on this page. The user can also select a specific review they have created to then 'pin' on their profile for everyone to see.

* Review: This page displays *a specific review* written by an user. It allows other users to comment on and express their opinion with the rating of the specific review. The comments that the owner of the review or other users have written about that specific review are all shown on that page.

* Add-Review: This page allows the user to *create a review for a specific game*. They enter the title, their rating, and a text if they want to further elaborate on the rating. Once the review is submitted, it will display on the correspondent game page.

### Entity-Relationship (ER) Diagram

![ER Diagram](./images/er_diagram.png)

## Teaser (MS3)

![Teaser](./images/teaser.png)
