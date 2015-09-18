describe("Pomodoro", function() {
  var pomodoro;
  var title, timer, alarm, start;

  beforeEach(function() {
    title = affix('h1.pomodoro-status');
    timer = affix('.timer');
    timer.affix('.row #timer');
    timer.affix('.row .actions button.start');
    timer.affix('.row .actions button.reset');
    alarm = affix('audio.alarm-audio');
    start = affix('audio.start-audio');
    pomodoro = pomodori.pomodoro;
  });

  it("should be able to be initialized", function() {
    expect(pomodoro.init(false, null, 0)).toBe(true);
  });
});
