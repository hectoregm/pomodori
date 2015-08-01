pomodori.pomodoro = (function () {
  var start_time, end_time, notification, timeoutID;
  var work_time, break_time, long_break_time;
  var work_minutes = 25;
  var break_minutes = 5;
  var long_break_minutes = 30;
  var state = "initial";
  var timer = document.querySelector('#timer');
  var alarmAudio = document.querySelector('.alarm-audio');
  var startAudio = document.querySelector('.start-audio');
  var status = document.querySelector('.pomodoro-status');
  var start = document.querySelector('.start');
  var reset = document.querySelector('.reset');
  var current_pomodoro = 1;
  var self = this;

  var init = function (testing, noti, current) {
    if (testing) {
      break_time = work_time = long_break_time = 'in 10 seconds';
      work_minutes = break_minutes = long_break_minutes = 0.1666;
    } else {
      work_time = 'in ' + work_minutes + ' minutes';
      break_time = 'in ' + break_minutes + ' minutes';
      long_break_time = 'in ' + long_break_minutes + ' minutes';
    }
    current_pomodoro = current; // Current index of pomodori in the task
    notification = noti;

    // Connect events for start and reset of pomodoro timer.
    $(start).on('click', function () {
      startWork();
    });

    $(reset).on('click', function () {
      resetPomodoro();
    });
  };

  var buildTimer = function () {
    Soon.create(timer, {
      due: work_time,
      layout: 'group',
      format: 'm,s',
      face: 'slot roll left fast',
      visual: 'ring cap-round invert progressgradient-fb801b_f1d935 ring-width-custom',
      scaleMax: 'fill'
    });
  };

  var startWork = function () {
    start_time = new Date();

    // If first time need to build timer, needed to be able to play
    // sound in iOS
    if (state === 'initial') {
      buildTimer();
    }

    state = "work";
    status.innerHTML = "Pomodoro #" + current_pomodoro;
    startAudio.play();

    // Hack to workaround iOS Safari limitation of
    // only loading/playing audio after an explicit user action
    alarmAudio.play();
    alarmAudio.pause();

    Soon.setOption(timer, 'due', work_time);

    timeoutID = window.setTimeout(function () {
      self.completed();
    }, work_minutes * 60 * 1000);

    $(start).addClass('hide');
    $(reset).removeClass('hide');
  };

  var startBreak = function (longBreak) {
    state = "break";

    status.innerHTML = "Break";
    $(reset).addClass('hide');

    if (longBreak) {
      Soon.setOption(timer, 'due', long_break_time);
      status.innerHTML = "Long Break";

      window.setTimeout(function () {
        self.completed();
      }, long_break_minutes * 60 * 1000);

    } else {
      Soon.setOption(timer, 'due', break_time);
      status.innerHTML = "Break";

      window.setTimeout(function () {
        self.completed();
      }, break_minutes * 60 * 1000);
    }
  };

  var resetPomodoro = function () {
    state = "standby";

    status.innerHTML = "Pomodoro Reset. Try Again ?";
    $(start).removeClass('hide');
    $(reset).addClass('hide');
    Soon.freeze(timer); // Stop timer
    window.clearTimeout(timeoutID); // Clear timeout
  };

  var completed = function () {
    end_time = new Date();
    alarmAudio.play();

    if (state === "work") {
      $.ajax({
        type: "POST",
        url: "/tasks/"+ pom.task_id + "/pomodori",
        dataType: "json",
        data: { pomodoro: { started_at: start_time ,
                            completed_at: end_time,
                            task_id: pom.task_id,
                            length: 25 } },
        success: function (data) {
          console.log(data);
          current_pomodoro += 1;
          startBreak(data.long_break);
          notification.create("Pomodoro Completed");
        },
        error: function(data) {
          console.log("Error in AJAX call.");
          console.log(data);
        }
      });
    } else if (state === "break") {
      $(start).removeClass("hide");
      status.innerHTML = "Continue ?";
      notification.create("Break Ended");
    }
  };

  return {
    init: init,
    completed: completed
  };
})();
