pomodori.pomodoro = (function () {
  var start_time, end_time, total, pomodoro_time, break_time;
  var state = "initial";
  var timer = document.querySelector('#timer');
  var alarmAudio = document.querySelector('.alarm-audio');
  var startAudio = document.querySelector('.start-audio');
  var title = document.querySelector('.title');
  var start = document.querySelector('.start');
  var reset = document.querySelector('.reset');

  var init = function (testing) {
    // Total number of pomodoros completed in this session
    total = 0;

    if (testing) {
      break_time = pomodoro_time = 'in 10 seconds';
    } else {
      pomodoro_time = 'in 25 minutes';
      break_time = 'in 5 minutes';
    }

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
      due: pomodoro_time,
      layout: 'group',
      format: 'm,s',
      face: 'slot roll left fast',
      visual: 'ring cap-round invert progressgradient-fb801b_f1d935 ring-width-custom',
      scaleMax: 'fill',
      eventComplete: completed
    });
  };

  var startWork = function () {
    start_time = new Date();

    // If first time need to build timer, need too to be able to play
    // sound in iOS
    if (state === 'initial') {
      buildTimer();
    }

    state = "work";
    title.innerHTML = "Pomodoro";
    startAudio.play();

    // Hack to workaround iOS Safari limitation of
    // only loading/playing audio after an explicit user action
    alarmAudio.play();
    alarmAudio.pause();

    Soon.setOption(timer, 'due', pomodoro_time);

    $(start).addClass('hide');
    $(reset).removeClass('hide');
  };

  var startBreak = function () {
    state = "break";

    title.innerHTML = "Break";
    $(reset).addClass('hide');

    if (total === 4) {
      Soon.setOption(timer, 'due', 'in 30 minutes');
      title.innerHTML = "Long Break";
    } else {
      Soon.setOption(timer, 'due', break_time);
      title.innerHTML = "Break";
    }
  };

  var resetPomodoro = function () {
    state = "standby";
    total = 0;

    title.innerHTML = "Pomodoro Reset. Try Again ?";
    $(start).removeClass('hide');
    $(reset).addClass('hide');
    Soon.freeze(timer);
  };

  var completed = function () {
    end_time = new Date();
    alarmAudio.play();

    if (state === "work") {
      $.ajax({
        type: "POST",
        url: "/pomodori",
        dataType: "json",
        data: { pomodoro: { started_at: start_time , completed_at: end_time, length: 25 } },
        success: function (data) {
          console.log(data);
          total += 1;
          startBreak();
        },
        error: function(data) {
          console.log("Error in AJAX call.");
          console.log(data);
        }
      });
    } else if (state === "break") {
      $(start).removeClass("hide");
      title.innerHTML = "Continue ?";
    }
  };

  return {
    init: init,
    completed: completed
  };
})();
