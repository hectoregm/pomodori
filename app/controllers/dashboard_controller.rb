class DashboardController < ApplicationController
  def index
    Time.use_zone("America/Mexico_City") do
      @total_today = Pomodoro.today.count
      @total_week = Pomodoro.by_week.count
    end
  end

  def today
    Time.use_zone("America/Mexico_City") do
      @tasks = Task.worked_today
    end
  end

  def week
  end
end
