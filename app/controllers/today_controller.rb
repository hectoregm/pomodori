class TodayController < ApplicationController
  def show
    @tasks = Task.where(today: true, done: false)
  end
end
