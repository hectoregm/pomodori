class PomodoriController < ApplicationController
  def new
    @task = Task.find(params[:task_id])
    gon.task_id = @task.id
    @pomodoro = Pomodoro.new
  end

  def show
    @pomodoro = Pomodoro.find(params[:id])
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

  def destroy
    @pomodoro = Pomodoro.find(params[:id])
    @pomodoro.destroy
    respond_to do |format|
      format.html { redirect_to task_path(@pomodoro.task), notice: 'Pomodoro was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def pomodoro_params
    params.require(:pomodoro).permit(:started_at,
                                     :task_id,
                                     :completed_at,
                                     :length)
  end
end
