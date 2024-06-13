import turtle
import colorsys
v=turtle.Turtle()
s=turtle.Screen()
s.bgcolor('black')
v.speed(0)
n=36
h=0
for i in range (460):
	c=colorsys.hsv_to_rgb(h,1,0.9)
	h+=1/n
	v.color(c)
	v.left(145)
	for j in range (5):
		v.forward(300)
		v.left(150)