pomodori.pomodoro = (function () {
  var start_time, state, end_time, total, pomodoro_time, break_time;
  var timer = document.querySelector('.soon');
  var alarm = document.querySelector('.alarm');
  var title = document.querySelector('.title');
  var start = document.querySelector('.start');

  var init = function (testing) {
    if (testing) {
      break_time = pomodoro_time = 'in 10 seconds';
    } else {
      pomodoro_time = 'in 25 minutes';
      break_time = 'in 5 minutes';
    }
    total = 0;

    $(start).on('click', function () {
      startWork();
    });

    startWork();
  };

  var startWork = function () {
    start_time = new Date();
    state = "work";

    title.innerHTML = "Pomodoro";
    Soon.setOption(timer, 'due', pomodoro_time);
    $(start).addClass("hide");
  };

  var startBreak = function () {
    state = "break";

    title.innerHTML = "Break";
    Soon.setOption(timer, 'du', break_time);
  }

  var completed = function () {
    end_time = new Date();
    alarm.play();

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
  }
})();
