# Evaluation of Spatial Attributes in Audio 
## Author: Ben Jordan

- This program was created to assist professor Sungyoung Kim with his research relating to spatial audio. 
This web-based program will be used to collect data on how users feel about aspects of audio such as clarity and 
immersiveness.
- I created this project part-time throughout the Fall '22 semester.

## Specifications
![SA1.png](..%2FSA1.png)
![SA2.png](..%2FSA2.png)
![SA3.png](..%2FSA3.png)
![Exp7.Spatial_HOLST.png](..%2FExp7.Spatial_HOLST.png)
- The above images were the specifications for the project given to me. I was given full control over how to 
design and implement this and ended deciding on angular and typescript to keep development organized.
- I also chose to use three.js for the 3D graphics. It was difficult to find any example projects combining three.js and 
Angular but they seemed to work well with each other for the most part. I had some trouble getting a GLSL loader to work
which would allow me to use GLSL files, but I ended up bypassing this by just writing my GLSL code as a string variable directly 
in my typescript files, and passing those shader strings to three.js.
- This was my first experience doing any programming with graphics libraries
such as three.js or using shader languages like GLSL and I had a lot of fun!


## ToDo
- The project is currently a prototype and I may make further changes depending on feedback from my professor. At the 
moment there is only one demo song and the program is just a client.
- The next steps for this project include hosting the project on a webserver, setting up a backend + database, and then
beginning data collection + research.
