class PomodoriController < ApplicationController

  def index
    @pomodori = Pomodoro.all
  end

  def show
    @pomodoro = Pomodoro.find(params[:id])
  end

  def new
    @task = Task.find(params[:task_id])
    gon.task_id = @task.id
    @pomodoro = Pomodoro.new
  end

  def create
    @pomodoro = Pomodoro.new(pomodoro_params)

    respond_to do |format|
      if @pomodoro.save
        format.json do
          render :show, status: :created
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
    params.require(:pomodoro).permit(:started_at, :task_id, :completed_at, :length)
  end
end
