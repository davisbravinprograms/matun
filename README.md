# MyStyle

An E-commerce website where people can buy fashion and lifestyle

## Screenshots

![App Screenshot](https://i.postimg.cc/K8FG80gy/ezgif-com-gif-maker.gif)

## Demo

http://mystyle.codestreak.in/

## User side Features

- Login/Signup with Google and Facebook
- OTP verification for normal Register
- Wishlist
- Cart
- Forget password / Change password
- Profile management
- Razorpay payment integration
- Pagination
- Search autofill
- Category wise product listing
- Product Filter and Sorting
- Order Tracking and cancellation
- Review and Rating for purchased products
- etc..

## Admin side Features

- User management
- Product management
- Category management
- Order management
- Banner management
- Coupon management
- Sales report
- Graphs
- etc...


## Run Locally

Clone the project

```bash
  git clone https://github.com/ch-mubarak/ecommerce
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm  start
```

for user side goto

```bash
  http://localhost:3000/
```

for admin side goto

```bash
  http://localhost:3000/admin
```

## Tech Stack

**Client:** EJS, CSS, Bootstrap

**Server:** Node, Express

**Database:** Mongodb, Mongoose

**Authentication** Passport JS, Google OAuth, Facebook OAuth

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`DATABASE_URL`

`SECRET` session key

`EMAIL` `EMAIL_PASSWORD`

`key_id` Razorpay key_id

`key_secret` Razorpay key_secret

`CLIENT_ID` Google oAuth CLIENT_ID

`CLIENT_SECRET` Google oAuth CLIENT_SECRET

`FACEBOOK_APP_ID` `FACEBOOK_APP_SECRET`

## Authors

- [Mubarak CH](https://www.github.com/ch-mubarak)
