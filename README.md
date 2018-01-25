# Prisma React Auth0 Example
Video Demo

[![](http://img.youtube.com/vi/y1zBjWhfPzQ/0.jpg)](http://www.youtube.com/watch?v=y1zBjWhfPzQ "Auth0")

🚀 Basic starter code for a fullstack app based on Prisma, Auth0, React, GraphQL & Apollo Client.

## Goals

My idea of a possible authentication flow for Prisma's Instagram clone. I am not an expert and put together this repo as a learning exercise. 

This repo follows the [Prisma Permissions](https://www.prismagraphql.com/docs/tutorials/graphql-server-development/permissions-thohp1zaih) tutorial without the ADMIN / CUSTOMER roles.

If you see any potential security issues, please let me know!
 
## Technologies

* **Frontend**
  * [React](https://facebook.github.io/react/): Frontend framework for building user interfaces
  * [Apollo Client](https://github.com/apollographql/apollo-client): Fully-featured, production ready caching GraphQL client
* **Backend**
  * [Auth0](http://www.auth0.com): Authentication as a service. (And this demo uses RS256 hotness!)
  * [Prisma](https://www.prismagraphql.com): Turns your database into a GraphQL API
  * [graphql-yoga](https://github.com/graphcool/graphql-yoga/): Fully-featured GraphQL server with focus on easy setup, performance & great developer experience
  * [prisma-binding](https://github.com/graphcool/prisma-binding): [GraphQL binding](https://blog.graph.cool/reusing-composing-graphql-apis-with-graphql-bindings-80a4aa37cff5) for Prisma services

## Requirements

You need to have the following things installed:

* Git
* Node 8+
* Prisma CLI: `npm i -g prisma`
* GraphQL CLI `npm i -g graphql-cli`
* Auth0 account

## Getting started

```sh
# 1. Clone it
git clone git@github.com:LawJolla/prisma-auth0-example.git

# 2. Navigate into the folder
cd prisma-auth0-example

#3 Install dependencies.  NPM should work if not using yarn
yarn install

#4 Install server dependencies
cd server
yarn install

#5 Make .env file
touch .env

#6 open .env in your editor of choice
code .env
```
Make your prisma secret
PRISMA_SECRET="myapp123"

```ssh

#7 Deploy Prisma cluster
prisma deploy

#8 Copy HTTP endpoint from Prisma, e.g. https://us1.prisma.sh... or localhost...

```

## .env file
Your .env now file now also needs the following:
``` 
PRISMA_ENDPOINT="YOUR_COPIED_ENDPOINT" # e.g. https://us1-prisma.sh...
AUTH0_DOMAIN="YOUR_AUTHO_DOMAN" # e.g. yourdomain.auth0.com
AUTH0_AUDIENCE="YOUR" # e.g. https://yourdomain.auth0.com/api/v2/
AUTH0_ISSUER="https://wheelk.auth0.com/" # e.g. https://yourdomain.auth0.com/
```
Your Auth0 console will provided the needed information above.

Make sure your audience is an API and not `https://...auth0.com/userinfo`.  That will not return an access token.  Only an API will.

```sh
#8 Start the server
yarn dev

#9 Configure your client Auth0 variables
cd ..
cd src/auth

#10 edit auth0-variables.js in your favorite editor
```
## auth0-variables.js
Edit these values with your Auth0 Config

```
export const AUTH_CONFIG = {
  api_audience: 'YOUR_API_AUDIENCE`, #same as above in server
  domain: 'YOUR_DOMAIN', // e.g. your-domain.auth0.com
  clientId: 'YOUR_CLIENT_ID', // e.g. string of characters from Auth0 for your API
  callbackUrl: "http://localhost:8000/callback" // make sure Auth0 has http://localhost:8000 as a callback url
}
```

```ssh
#11 Start the client
yarn start

#12 Navigate to localhost:8000

#13 See what errors you get 🤣
```

Your feedback is **very helpful**, please share your opinion and thoughts! If you have any questions, join the [`#graphql-boilerplates`](https://prisma.slack.com/messages/graphql-boilerplates) channel on our [Slack](https://prisma.slack.com/).
