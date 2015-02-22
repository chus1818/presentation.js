# Presentation.js

Have you ever had to give a talk about javascript and faced the situation in which you have to decide between 
start writing a bunch of powerpoints (that are undoubtedly going to be provided with narcotic properties) or 
start typing the code you want to actually demonstrate while you are talking? Daunting, uh? Well, fear no more.

Presentation.js provides a simple interface to amend this kind of situation using a mixture of the good parts of each
option. You will write a source presentation file that will contain any text you want to display along with any code
you want to run during the talk, and let the script display it. And if something happens and you need to improvise your
repl will still be completely available to you.

## Getting started

Clone the repo :D

## Usage

### The source presentation file

First of all you will need the contents of your presentation. Create a plain text file with them. Each new line in that file
will be treated as a separate step, and anything you surround with the tags >> and << will be interpreted as code, which will
be presented in two different steps: the first one will show your source, and the second one will display its output. Here
is an example:

```text
This is the first step, in which you talk about your background and make some jokes about it.

This is the second step, in which you say you are going to show some mind blowing piece of code.

>>
  console.log('This is the mind blowing code');
  console.log('It does not seem to be that great... but something unexpected is going on under the hood');
<< 

This is the step 5 in which you continue, straight to glory.
```

### The repl interaction

You will typically use presentation.js from a javascript console such the one provided by node. In order to do so
require the library and initialize a presentation object:

```javascript
  imported = require('./presentation.js');
  myPresentation = imported.presentation({location: 'my_presentation_source'});
  myPresentation.start()
```

Now you can start your talk using the console interactively. Use the next and previous methods to navigate the content of your presentation object:

```javascript
  myPresentation.next()     // #=> This is the step one of my presentation. The next step is a code evaluation.
  myPresentation.next()     // #=> Evaluating:\ == 2 + 2\ ==
  myPresentation.previous() // #=> This is the step one of my presentation. The next step is a code evaluation.
  myPresentation.next(2)    // #=> 4
```

If your audience is not good enough you can leave the room by finishing the presentation:

```javascript
  myPresentation.finish()
```

If, on the other hand, they are amazed and want a second round you can start again from the beginning:

```javascript
  myPresentation.restart()
```

## Contributing

Feel free to send any contribution!

## License

Presentation.js is released under the [MIT License](http://opensource.org/licenses/MIT).
