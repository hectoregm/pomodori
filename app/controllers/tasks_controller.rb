class TasksController < ApplicationController
  before_action :set_list, only: [:index, :create, :update]
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def index
    @query = params[:all] ? {} : { done: false }
    @task = Task.new
    @tasks = @list.tasks.where(@query)
  end

  def show
    @pomodori = @task.pomodori
  end

  def new
    @task = Task.new
  end

  def edit
  end

  def create
    @task = @list.tasks.build(task_params)
    handle_model(@task.save)
  end

  def update
    handle_model(@task.update(task_params), :ok)
  end

  def destroy
    @task.destroy
    respond_to do |format|
      format.html { redirect_to tasks_url, notice: 'Task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private

  def handle_model(success, status = :created)
    respond_to do |format|
      if success
        format.html { redirect_to list_tasks_path(@list), notice: "Task was successfully #{status}" }
        format.json { render :show, status: status, location: @task }
      else
        format.html do
          @tasks = Task.where(@query)
          render(status == :created ? :index : :edit)
        end
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def set_task
    @task = Task.find(params[:id])
  end

  def set_list
    # FIXME: Add default for Dashboard link
    id = params[:list_id] || List.last.id
    @list = List.find(id)
  end

  def task_params
    params.require(:task).permit(:name, :done, :estimate)
  end
end
