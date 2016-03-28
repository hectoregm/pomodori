class DashboardController < ApplicationController
  def show
    @total_today = Pomodoro.today.count
    @total_week = Pomodoro.by_week.count
  end

  def today
    @tasks = Task.worked_today
  end

  def week
    Chronic.time_class = Time.zone
    @monday = Chronic.parse('this week monday 0:00')
  end
end
