if (!Array.prototype.last){
  Array.prototype.last = function(){
      return this[this.length - 1];
  };
};

if (!Array.build){
  Array.build = function(variable) {
    if(variable.constructor === Array) {
      return variable;
    } else {
      return Array(variable);
    };
  };
};

var presentation = function(specs) {
  if(specs.location) {
    var location = specs.location;
  } else {
    throw "A source presentation file location is required";
  };
  
  var fs = require("fs");

  var defaultStart = function() {
    var welcomeMessage = "Welcome to you presentation assistant. \n" +
                         "Your presentation has been loaded successfully.";
    console.log(welcomeMessage);
  };

  var defaultFinish = function() {
    farewellMessage = "Thanks for watching";
    console.log(farewellMessage);
  };

  var step = function(specs) {
    var content = Array.build(specs.content);

    var that = { content: content, type: specs.type };

    that.present = function() {
      return this.content.join('\n');
    };

    that.eval = function() {
      if(this.type == 'code') {
        console.log('=> ' + eval(this.content.join(' ')));
      } else if (this.type == 'raw') {
        console.log('Evaluating:');
        console.log('==');
        console.log(this.present());
        console.log('==');
      } else {
        console.log(this.present());
      };
    };

    return that;
  };

  var parseSteps = function(fileLocation) {
    var steps = [];
    var fileContents = fs.readFileSync(fileLocation, 'utf8').split('\n');

    for(var i = 0; i < fileContents.length; i++) {
      if(fileContents[i] == '>>') {
        capturedCode = captureCode(fileContents, i);
        steps.push(step({content: capturedCode.raw, type: 'raw'}));
        steps.push(step({content: capturedCode.raw, type: 'code'}));
        i = capturedCode.endsAt;
      } else if (fileContents[i].length != 0) {
        steps.push(step({content: fileContents[i], type: 'string'}));
      }
    }

    return steps;
  };

  var captureCode = function(contents, blockInitial) {
    var blockFinal;

    for (var i = blockInitial + 1; i < contents.length; i++) {
      if(contents[i].trim() === '<<') {
        blockFinal = i;
        break;
      };
      if(i == contents.length || contents[i].trim() === '>>') {
        throw 'Code could not be captured. Revisit your source file.';
      };
    };

    return {
      startsAt: blockInitial,
      endsAt: blockFinal,
      raw: contents.slice(blockInitial + 1, blockFinal)
    };
  };

  var evalStep = function(presentation) {
    presentation.steps[presentation.currentStep - 1].eval();
  };

  var that = {};

  that.start = function(options) {
    var options = options || {};
    var step = options.step || 0;
    var premiere = specs.onStart || defaultStart;

    this.steps = parseSteps(location);
    this.currentStep = step;

    premiere();
    this.started = true;
  };

  that.restart = that.start;

  that.next = function(steps) {
    if(!this.started) throw 'The presentation is not started';
    var steps = steps || 1;

    if (steps == 1 && this.currentStep + steps == this.steps.length + 1) {
      this.finish();
    } else if(this.currentStep + steps > this.steps.length) {
      console.log('The given step is not available');
    } else {
      this.currentStep += steps;
      evalStep(this);
    };
  };

  that.previous = function(steps) {
    if(!this.started) throw 'The presentation is not started';
    var steps = steps || 1;

    if(this.currentStep - steps >= 1) {
      this.currentStep -= steps;
    } else {
      console.log('The given step is not available');
      return;
    };

    evalStep(this);
  };

  that.finish = function() {
    var finale = specs.onFinish || defaultFinish;
    finale();
    this.started = false;
  };

  return that;
};

exports.presentation = presentation;