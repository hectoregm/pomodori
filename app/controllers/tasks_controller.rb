class TasksController < ApplicationController
  before_action :set_project, only: [:index, :create, :update]
  before_action :set_task, only: [:show, :edit, :update, :destroy]

  def index
    @query = params[:all] ? {} : { done: false }
    @task = Task.new
    @tasks = @project.tasks.where(@query)
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
    @task = @project.tasks.build(task_params)
    handle_model(@task.save)
  end

  def update
    handle_model(@task.update(task_params), :ok)
  end

  def destroy
    destroy_record(@task)
  end

  private

  def handle_model(success, status = :created)
    respond_to do |format|
      if success
        format.html { redirect_to project_tasks_path(@project), notice: "Task was successfully #{status}" }
        format.json { render :show, status: status, location: @task }
      else
        format.html do
          @query = params[:all] ? {} : { done: false }
          @tasks = @project.tasks.where(@query)
          render(status == :created ? :index : :edit)
        end
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def set_task
    @task = Task.find(params[:id])
  end

  def set_project
    # FIXME: Add default for Dashboard link
    id = params[:project_id] || Project.last.id
    @project = Project.find(id)
  end

  def task_params
    params.require(:task).permit(:name, :done, :today, :estimate)
  end
end
