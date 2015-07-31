pomodori.notification = (function () {
  var supported = true;

  var init = function () {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      supported = false;
    }

    if (supported) {
      Notification.requestPermission();
    }
  };

  var create = function (theBody) {
    var notification;
    var options = {
      body: theBody,
    };

    if (supported) {
      return new Notification("Pomodori", options);
    } else {
      return null;
    }
  };

  return {
    init: init,
    create: create
  };
})();
