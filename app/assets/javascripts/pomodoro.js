pomodori.pomodoro = (function () {
  var start_time, state, end_time, total;
  var timer = document.querySelector('.soon');
  var alarm = document.querySelector('.alarm');
  var title = document.querySelector('.title');
  var start = document.querySelector('.start');

  var init = function () {
    console.log("In init");
    start_time = new Date();
    state = "work";
    total = 0;

    $(start).on('click', function () {
      console.log("Clicked Start button");
      start();
    });
  };

  var start = function () {
    start_time = new Date();
    state = "work";

    title.innerHTML = "Pomodoro";
    Soon.setOption(timer, 'due', 'in 10 seconds');
  };

  var completed = function () {
    console.log("In completed");
    end_time = new Date();
    alarm.play();

    if (state === "work") {
      $.ajax({
        type: "POST",
        url: "/pomodori",
        dataType: "json",
        data: { pomodoro: { started_at: start_time , completed_at: end_time, length: 25 } },
        success: function (data) {
          console.log("Successful AJAX call.");
          console.log(data);

          console.log("Start of break");
          state = "break";
          title.innerHTML = "Break";
          Soon.setOption(timer, 'due', 'in 10 seconds');
        },
        error: function(data) {
          console.log("Error in AJAX call.");
          console.log(data);
        }
      });
    } else if (state === "break") {
      console.log("End of break");
      $('.start').removeClass("hide");
      title.innerHTML = "Continue ?";
    }
  };

  return {
    init: init,
    completed: completed
  }
})();
