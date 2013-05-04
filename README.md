#SaxonJS

A RPG character generator for [Mouse Guard](http://www.mouseguard.net/books/role-playing-game/). For the DM who doesn't feel like spending a whole afternoon with friends eating pizza, drinking beer, and going through a book building characters. One button click will generate a mouse randomly so everyone can dive in and start playing.

----
## Running Saxon Locally
__SaxonJS__ runs on [Tornado](http://www.tornadoweb.org/en/stable/). So after you've cloned this repo and assuming you're already in the directory you cloned into, run:

`python main.py --port=8888`

All of the logic for generating a character is done client-side. So once you've run the tornado app, you're good to go. Just point your browser to `localhost:8888` and you should see the character generator.

---
## Deploy to a server
You can go with [Tornado](http://www.tornadoweb.org/en/stable/) in which case you'll need a UNIX-like system with a version of Python in the 2.x series installed. Python package requirements are specified in a pip-compatible `requirements.txt`, located in this repository. But you can do this anyway you want, really. You might have to do a little copy/paste to get the templates out and into your setup.

I've been using [Heroku](https://www.heroku.com/) to deploy to the world. You can see it [here](http://thawing-dusk-9851.herokuapp.com).

For more info on how to deploy a Tornado app on Heroku, [go here](https://github.com/mikedory/Tornado-Heroku-Quickstart).

Curious about the Mouse Guard RPG? [Check this out](http://www.burningwheel.org/forum/forumdisplay.php?41-Mouse-Guard-RPG)