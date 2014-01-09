![Stationary](https://raw.github.com/simonlast/stationary/master/screenshot.png)

# Stationary

Stationary is a simple and fun tool for creating static websites.

### Why?

I was trying to help a few friends make a static website, and was discouraged by the complexity and slow feedback loops present in current tools.

## Setup

`npm install`

`[sudo] node server/server.js`

(You'll only need `sudo` on a computer that protects port 80, like a Mac.)

--> [localhost](http://localhost)

## Instructions

To log in, go to `/login`

To log out, go to `/logout`

To view a page, go to `/name-of-your-page`

To make a new page, or edit an existing one, go to, go to `/edit/name-of-your-page`

You can make any kind of plain text file you'd like. For example:

`/edit/fancy_styles.css`

`/edit/game.js`

`/edit/about.html`

Type in the code editor. When you're in an html page, you'll see a live preview on the right.

## Details

All of the code that runs the editor is bootstrapped, and thus editable within the editor itself.

Take a look at `/edit/main.js`. This is the starting point for the application.

Documentation for how to use the bootstrapping mechanism is available in `/edit/docs.txt`