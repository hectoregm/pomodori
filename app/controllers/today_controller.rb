class TodayController < ApplicationController
  def show
    @tasks = Task.where(today: true)
  end
end
