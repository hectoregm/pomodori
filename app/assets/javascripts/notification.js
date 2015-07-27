pomodori.notification = (function () {
  var supported = true;

  var init = function () {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      supported = false;
    }

    // Request permission to the user
    Notification.requestPermission();
  };

  var create = function (theBody) {
    var options = {
      body: theBody,
    };

    return new Notification("Pomodori", options);
  };

  return {
    init: init,
    create: create
  };
})();
