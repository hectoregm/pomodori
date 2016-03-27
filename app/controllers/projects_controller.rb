class ProjectsController < ApplicationController
  def index
    @project = current_user.projects.build
    @projects = current_user.projects.persisted
  end

  def create
    @project = Project.new(project_params)
    @project.user = current_user

    respond_to do |format|
      if @project.save
        format.html do
          redirect_to projects_path,
                      notice: 'Project was successfully created'
        end
        format.json { render :show, status: status }
      else
        format.html do
          @projects = Project.all
          render :index
        end
        format.json { render json: @task.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @project = Project.find(params[:id])
    destroy_record(@project)
  end

  private

  def project_params
    params.require(:project).permit(:name)
  end
end
