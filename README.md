# IVR Call Recording and Agent Conference. Level: Intermediate. Powered by Twilio - Express

An example application implementing an automated phone line using Twilio and Express.

[Read the full tutorial here](https://www.twilio.com/docs/tutorials/walkthrough/ivr-screening/node/express)!

[![Build Status](https://travis-ci.org/TwilioDevEd/ivr-recording-node.svg?branch=master)](https://travis-ci.org/TwilioDevEd/ivr-recording-node)

## Local Development

1. This sample application stores data in a [MongoDB](https://www.mongodb.org/) database using [Mongoose](http://mongoosejs.com/). You can download and run MongoDB yourself (OS X, Linux, Windows).

   On OS X, maybe the easiest way to get MongoDB running locally is to install via [Homebrew](http://brew.sh/).

   ```
   $ brew install mongodb
   ```

   You should then be able to run a local server with:

   ```
   $ mongod
   ```

2. Clone this repository and `cd` into its directory:
   ```
   $ git clone git@github.com:TwilioDevEd/ivr-recording-node.git
   $ cd ivr-recording-node
   ```

3. To seed the initial data into the database by running the following:
   ```
   $ mongo localhost/call-screening seed/agents.js
   ```

4. Install dependencies:
   ```
   $ npm install
   ```

5. Run the application.
  ```
  $ npm start
  ```

6. Check it out at [http://localhost:3000](http://localhost:3000)

7. Expose the application to the wider Internet using [ngrok](https://ngrok.com/)
   To let our Twilio Phone number use the callback endpoint we exposed, our development server will need to be publicly accessible. [We recommend using ngrok to solve this problem](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html).

   ```
   ngrok http 3000
   ```

9. Provision a number under the [Manage Numbers page](https://www.twilio.com/user/account/phone-numbers/incoming) on your account. Set the voice URL for the number to `http://<your-ngrok-subdomain>.ngrok.io/ivr/welcome`.

That's it!

## Meta

* No warranty expressed or implied. Software is as is. Diggity.
* [MIT License](http://www.opensource.org/licenses/mit-license.html)
* Lovingly crafted by Twilio Developer Education.
