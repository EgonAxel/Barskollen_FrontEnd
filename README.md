# Barskollen_FrontEnd

Jakob Reinholdsson, Carl Lindholm, Egon Axelsson, Simon Sjögren

Kandidatarbete VT2021

# Barskollen description:
Bärskollen is a cross-platform application for ios and andriod where users are given the ability to review, preview and get recommendations of Swedish beers.

# Get started

Download the 'Barskollen_FrontEnd' repository as a zip (https://github.com/EgonAxel/Barskollen_FrontEnd) and place the folder locally on your computer.

shift- or option-click on the folder, and copy the folder's name as a search path.

Open a new terminal window, write 'cd ' and enter the folder's path you just have copied, and press 'enter'.

# Run the application

# Connect to BackEnd

To connect to the database, start 'Barskollen_BackEnd' (https://github.com/sjogr3n/Barskollen_BackEnd)

Copy the path to your running API

Insert the path in all '.get' & '.post' functions (The default path is 127.0.0.1:8000). 

The path need to be inserted in a total of 11 places in the following files:

ExploreBeer.js, IndividualBeer.js, LogIn.js, Register.js, ReviewBeer.js, USerProfile.js

# Run Application

Using Expo start the application with command 'expo start' 

From Expo client in browser use android/iOS simulator or scan the QR-code with the Expo GO app.
