# s3lector - AWS S3 Web Downloader

Built on the MEAN stack: [mean.io](http://mean.io).


s3lector is a web front end to allow authenticated downloads from Amazon S3 buckets.


Configured buckets are listed and file info is stored in a Mongo DB. 
File info is presented to logged in users as a filterable list. 
When a file is selected for download, a temporary signed url is generated for the S3 object to allow the user to access the object.
A bucket can be marked as private - only users with private access level can view these files.
Any configured bucket is set as public by default - authenticated users can view access all files.


## Prerequisites
* A server with nodejs, mongodb and npm installed
* an AWS user and credentials with access to your S3 bucket

## Additional Packages
* Express - Defined as npm module in the [package.json](package.json) file.
* Mongoose - Defined as npm module in the [package.json](package.json) file.
* Passport - Defined as npm module in the [package.json](package.json) file.
* Bower - Defined as npm module in the [package.json](package.json) file.
* AngularJS - Defined as bower module in the [bower.json](bower.json) file.
* Twitter Bootstrap - Defined as bower module in the [bower.json](bower.json) file.
* UI Bootstrap - Defined as bower module in the [bower.json](bower.json) file.

## Quick Install
  The quickest way to get started is to use openshift.

  Use the following command, make sure that you run 'gem update rhc' first so that you have the newest version:

	  rhc app create s3lector nodejs-0.10 mongodb-2.2 --env NODE_ENV=production --from-code https://github.com/pr8kerl/s3lector.git

  Then clone the resulting application repo, update config/env/production.js with passport credentials.

  Log in to your application using ssh and access the Mongo shell and manually select your database (use s3lector).
  Then copy and paste the contents of config/mkAdmin.js into mongo shell. Need to work out a better way to do this.

  Push your changes to openshift and then access the url for your app. Log in as the default admin created previously to test access.

  Follow your nose. You'll work it out.


## Slow Install
  Setup your own environment using Node and MongoDB.

  Install dependencies:

    $ npm install

  Create config file
  ```cp config/env/production.js config/env/development.js```
  Configure passport and AWS access in **config/env/development.js**

  Create an admin user in the database using the mongo script

    cd config
    mongo <db name> ./mkAdmin.js

  Start the server:

    $ grunt
    
  Then open a browser and go to:

    http://localhost:3000

  Authenticate as a new user

  Logout and log back in as the admin user.

  Set your new user as an admin.

  Log out and in as previous user and remove the default admin.

  Configure a bucket 

  Load bucket contents into database (this lists files in the bucket once and stores that info in the mongo db).


## To Do

Remaining intended features
* allow S3 object upload for admins
* allow api access to load S3 file info into database

## More Information
  * Go to [mean.io](http://mean.io) for info about the MEAN stack.
  * Contact me for any s3lector issue via [E-Mail](mailto:goodbloke@gmail.com)

## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
