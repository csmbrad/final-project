# Proposal

Our intent for the final project for Webware, A20 is to make a messaging webapp using drawn images.

## Expected Functionality ##

A user will be able to create an account at our website codenamed: PixelTalk

From this account, a user will be able to view an inbox of drawings that they have received from people. 
They will be able to compose a new drawing within 20-30 seconds at which point, the drawing will be sent.
A user must specify their target before they send, but can cancel during the drawing.

On the backend, drawings will be removed from the database 24 hours after opening.

The drawing program will use WebGL to make a 2D drawing.

## Group Members ##

- Brad Cosma
- Carly Pereira
- Jake Pelrah
- Noah Olson
- Patrick Houlihan

## Implementation Goals

## UI ##

### Team : Carly Jake ###
- Login Screen
- Gallery with image preview
- inbox screen
- create drawing screen
- address list of contacts
- user search

- #### Drawing UI ####

## SERVER ##

### Team : Noah Brad ###

- Handle OAuth 
- Express
- Glitch
- Server must notify recipient on image creation
- Server must deliver image
- Helmet
- user search
- Add/remove friends

## DB ##

### Team : Noah Brad ###

- Each user will have an inbox of received drawings
- inbox stores image, sender, time sent
- Images will be stored for 24 hours and will be deleted (if unopened)
- Friends (Collection of added users)

## DRAWING APPLICATION ##

### Team : Patrick Jake ###

- Color Swathes
- Fill Bucket
- 200/250 x 200/250 img size
- STRETCH (PREDRAWN COMPONENTS)

- #### Drawing UI ####

## LOGIN/ACCOUNTS ##

### Team : Noah Brad ###

- Profile Picture
- GitHub OAuth

## REAL TIME ##

- Alert when drawing is started
- Alert when drawing is sent
- Alert when drawing is opened
