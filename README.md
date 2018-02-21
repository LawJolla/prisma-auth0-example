# Prisma React Auth0 Example
Video Demo

[![](http://img.youtube.com/vi/y1zBjWhfPzQ/0.jpg)](http://www.youtube.com/watch?v=y1zBjWhfPzQ "Auth0")

🚀 Basic starter code for a fullstack app based on Prisma, Auth0, React, GraphQL & Apollo Client.

## Goals

My idea of a possible authentication and authorization flow for Prisma's Instagram (blog?) clone. I am not an expert and put together this repo as a learning exercise. 

This repo follows the [Prisma Permissions](https://www.prismagraphql.com/docs/tutorials/graphql-server-development/permissions-thohp1zaih).

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
* Auth0 account
* Basic Auth0 Console Knowledge -- this demo is short on how to configure the Auth0 console, but even a novice Auth0 user should get it.  I did!  This is my first project using Auth0.

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

#6 open .env in your editor of choice, e.g.
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
AUTH0_AUDIENCE="YOUR_API/AUDIENCE" # e.g. https://yourdomain.auth0.com/api/v2/
AUTH0_ISSUER="https://YOUR_AUTH0_DOMAIN" # e.g. https://yourdomain.auth0.com/
```
Your Auth0 console will provided the needed information above.

Make sure your audience is an API and not `https://...auth0.com/userinfo`.  That will not return an access token.  Only an API will.

```sh
#8 Start the server
yarn dev

#9 Configure your client Auth0 variables
cd ..
cd src/auth

#10 Create an auth0-variables file
touch auth0-variables

#11 Edit auth0-variables.js in your favorite editor, e.g.
code auth0-variables
```
## auth0-variables.js
Copy and paste the AUTH_CONFIG below, and fill in the variables, and save

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

#Directive Permissions

This demo uses the new-ish GraphQL directive permission pattern.  Here's a great video from Ryan Chenkie, a developer at Auth0, describing how it works.

[![](http://img.youtube.com/vi/4_Bcw7BULC8/0.jpg)](https://www.youtube.com/watch?v=4_Bcw7BULC8 "Auth0")

Tl;dr:  Simply decorate your fields / queries / mutations with directives, and let the directive resolvers handle the rest!
