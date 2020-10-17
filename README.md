# PixelTalk
Created by:
- Brad Cosma
- Carly Pereira
- Jake Pelrah
- Noah Olson
- Patrick Houlihan

## About the Application

!! ADD LINK TO PROJECT !!

PixelTalk is a webapp that allows users to interact predominantly through image rather than text.
Our intentions behind this project were to force users to think about what they say online, where discourse can feel impersonal and harsh.
By having communication occur visually, it incentivizes users to actually draw out or symbolize what they want to convey. By enforcing a time limit on drawings, users are also incentivized to think about what they want to say beforehand.

### The Login Page
To login click *sign in with GitHub*, and enter your credentials.
![Login Page](public/images/login_pic.png)


### The Inbox Page
After signing in with GitHub users will be greeted by their inbox, a page that shows all users that are friend. Included on this page is the users country flag, profile picture, and username as well as a logout and send drawing button. One of our favorite features on this page is the ability to draw your own profile picture! To do this, click on your profile picture and use the drawing application to complete your portrait.

!! INSERT PIC HERE !!

### The Gallery Page
After clicking on a user in your inbox page, you will be brought to the gallery page. This view shows all messages recieved from that user, as well as their country flag, profile picture, and username. From this page, you can view drawings or click the send arrow to send the current user a drawing.

!! INSERT PIC HERE !!

### The Drawing Page
The drawing application features 9 colors and a size slider. Simply choose a color, brush size and begin drawing! Once the first brush stroke is made, a 20s timer will start. When the timer ends, the drawing will be sent.

!! INSERT PIC HERE !!


## Technologies Outline
- Passport Express Middleware
- Github OAuth
- Bootstrap CSS framework
- BodyParser

## Challenges Faced
- Animating the drawing recreation of the image
  - Race conditions were encountered as stroke color would be set irrespective of how the program executed
- Properly maintaining a Git repository
  - Git merges were infrequent, leading to large merges of branches using various states of the master branch happening all at once
- Improper legacy data formatting
  - Repeated changes in the desired data format cost significant amounts of time 
  - example, in the database, some drawings would have their animation instruction field as Instruction, while others would be instruction

## Responsibilities
!! COMMENT !! Feel free to add more detail here, I figured id leave this blank until the project was done
### UI
Carly Pereira & Jake Pelrah

The UI features modals and cards primarily to present a user with easy to access message inventories

### Server
Brad Cosma & Noah Olson

### Database
Brad Cosma & Noah Olson

### Drawing Application
Jake Pelrah & Patrick Houlihan

The drawing application is utilized in three different areas of the project, to produce profile pictures, produce images to send, and recreate and animate images. Images are exported as PNG's as well as instruction sets, which are understood by the drawing program.

## Project Video
