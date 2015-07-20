class PomodoriController < ApplicationController

  def index
    @pomodori = Pomodoro.all
  end

  def show
    @pomodoro = Pomodoro.find(params[:id])
  end

  def new
    @pomodoro = Pomodoro.new
  end

  def create
    @pomodoro = Pomodoro.new(pomodoro_params)

    respond_to do |format|
      if @pomodoro.save
        format.json do
          render :show, status: :created, location: @pomodoro
        end
      else
        format.json do
          render json: @pomodoro.errors,
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def pomodoro_params
    params.require(:pomodoro).permit(:started_at, :completed_at, :length)
  end
end
