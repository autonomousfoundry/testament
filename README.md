Introduction
------------

The goal of this project is to provide a minimal toolset for easy
comprehensive [test-driven
development](http://en.wikipedia.org/wiki/Test-driven_development) for
JavaScript projects that use [Node.js](http://nodejs.org).  It's
currently more difficult than it should be to set up fully automated,
headless tests from the unit level through the browser-based
acceptance level in a single testing framework, and this project is
intended to smooth over the gaps in existing tools.  Ideally, this
project will make itself obsolete quickly by providing inspiration for
adding missing features to the more mature existing testing tools.

Usage
-----

* Make sure [Node](http://nodejs.org) and [npm](http://npmjs.org) are
  installed.

* From the testament project directory, use npm to install
  dependencies:

        npm install

* Make sure bin/testament is in your path, and run it:

        testament

This will look for a *test* directory under the current directory, and
run all its .js files directly using node.  The test runner will keep
running, and re-run the tests whenever *any* files under the current
directory change.

Look at the example test file to see how to use testament's library to
actually perform the testing, and then run testament from your own
projects.

Copyright
---------

Copyright (C) 2011 Autonomous Foundry LLC, all rights reserved. See
LICENSE for details.