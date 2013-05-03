#!/usr/bin/env python
#
#	      Socialbomb presents:
#	   the Tornado quickstart kit
#
#	       Author:  Mike Dory
# 	       Date:    12.12.11
#
#  Socialbomb: since naughtical times
#
debug = True

import os.path
import tornado.auth
import tornado.escape
import tornado.httpserver
import tornado.ioloop
import tornado.options
import tornado.web
import unicodedata
import httplib

# import and define tornado-y things
from tornado.options import define, options
define("port", default=8888, help="run on the given port", type=int)

# enable logging
if (debug == True):
	import logging
	tornado.options.parse_command_line() 
	log = logging.info

##############
## settings ##
##############

# application settings and handle mapping info
class Application(tornado.web.Application):
	def __init__(self):
		handlers = [
			(r"/", HomeHandler),
			(r"/page/?", PageHandler),
			(r"/page/([^/]+)/?", PageHandler)
		]
		settings = dict(
			template_path=os.path.join(os.path.dirname(__file__), "templates"),
			static_path=os.path.join(os.path.dirname(__file__), "src"),
			ui_modules={"Some": SomeModule},
			debug="True"
		)
		tornado.web.Application.__init__(self, handlers, **settings)

###################
## page handlers ##
###################

# base handler for use across other things (and have a DB connection, if desired)
class BaseHandler(tornado.web.RequestHandler):
	def get(self):
		pass

# teh home
class HomeHandler(BaseHandler):
	def get(self):
		self.render(
			"home.html", 
			page_title='Home',
			page_heading='home'
		)


# dynamic page handler
class PageHandler(BaseHandler):
	def get(self, page=None):
		
		#if you are on the /page/ page
		if page is None:
			self.render(
				"page.html", 
				page_title='Some page',
				page_heading='somepage',
				page=None
			)
		elif page=="something":					
			self.render(
				"page.html", 
				page_title='Something else',
				page_heading='somethingelse',
				page=page
			)
		else:
			self.render('404.html')


#####################
## custom handlers ##
#####################

# aww, too bad, you don't have a page there buddy?
class NotFoundHandler(BaseHandler): 
	def prepare(self): 
		self.render("404.html") 


# custom error handling, you say?  why here you go!		
class ErrorHandler(tornado.web.RequestHandler):
	"""Generates an error response with status_code for all requests."""
	def __init__(self, application, request, status_code):
		tornado.web.RequestHandler.__init__(self, application, request)
		self.set_status(status_code)
		
	def get_error_html(self, status_code, **kwargs):
		self.require_setting("static_path")
		if status_code in [404, 500, 503, 403]:
			filename = os.path.join(self.settings['static_path'], '%d.html' % status_code)
			if os.path.exists(filename):
				f = open(filename, 'r')
				data = f.read()
				f.close()
				return data
			return "<html><title>%(code)d: %(message)s</title>" \
				"<body class='bodyErrorPage'>%(code)d: %(message)s</body></html>" % {
				"code": status_code,
				"message": httplib.responses[status_code],
			}
		
	def prepare(self):
		raise tornado.web.HTTPError(self._status_code)

## override the tornado.web.ErrorHandler with our default ErrorHandler
tornado.web.ErrorHandler = ErrorHandler


#############
## modules ##
#############

# module for processing the apps page
class SomeModule(tornado.web.UIModule):
	def render(self, some):
		return self.render_string("modules/some.html", some=some)



#####################
## ready, set, run ##
#####################

# warm it up
def main():
	tornado.options.parse_command_line()
	http_server = tornado.httpserver.HTTPServer(Application())
	http_server.listen(options.port)

	# log it
	if (debug == True):
		log('starting up tornado ioloop')
		log("running on port: %d" % options.port)

	# start it up
	tornado.ioloop.IOLoop.instance().start()


# kickoff
if __name__ == "__main__":
	main()
