
import turtle as t

import time 
t.tracer(0, 0)
screen = t.Screen()
t.title("GenJutsu")
#  developer.varun(instagram)
def cir():
    t.home()
    t.goto(0,-140)
    t.shape('blank')
    t.color('black','red')
    t.width(4)
    t.begin_fill()
    t.circle(200)
    t.end_fill()
    t.penup()
    t.left(90)
    t.forward(160)
    t.right(90)
    t.pendown()
    t.color('black')
    t.begin_fill()
    t.circle(40)
    t.end_fill()
    t.penup()
    t.right(90)
    t.forward(60)
    t.left(90)
    t.pendown()
    t.width(3)
    t.color('grey')
    t.circle(100)

class yin():
    def __init__(self, turtle):
        self.turtle = turtle.clone()
        
    def draw(self, angle, distance):
        t.right(angle)
        
        self.turtle.penup()
        self.turtle.forward(100)
        self.turtle.right(5)
        self.turtle.pendown()
        self.turtle.color('black','black')
        
        self.turtle.begin_fill()
        self.turtle.circle(distance,180)
        self.turtle.right(180)
        self.turtle.circle(-2*distance,180)
        self.turtle.circle(-1*distance,180)
        self.turtle.end_fill()

    def erase(self):
        self.turtle.clear()

    def go(self):
        self.turtle.goto(0,60)

t.penup()
t.goto(0, 60)
t.pendown()
t.shape("blank")

a = yin(t)
t.right(120)
b = yin(t)
t.right(120)
c = yin(t)

i = 0
for j in [a,b,c]:
    j.erase()

try:    
    while True:
        cir()
        for j in [a,b,c]:
            j.draw(i, 10)
        screen.update()
        for j in [a,b,c]:
            j.go()
            j.erase()
        time.sleep(0.01)
        i+=0.01
except:
    print("Thanks for using")

