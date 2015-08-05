class DashboardController < ApplicationController
  def index
    @total_today = Pomodoro.today.count
    @total_week = Pomodoro.by_week.count
  end

  def today
    @tasks = Task.worked_today
  end

  def week
    @tasks = Task.worked_week
  end
end
