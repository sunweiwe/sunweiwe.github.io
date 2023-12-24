all:
	hugo
	
server:
	hugo server -D --disableFastRender

post:
	hugo new posts/