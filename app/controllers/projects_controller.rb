class ProjectsController < ApplicationController
  def index
    @project = Project.new
    @projects = Project.all
  end

  def create
    @project = Project.new(project_params)
    @project.save

    respond_to do |format|
      format.html { redirect_to projects_path, notice: "Project was successfully #{status}" }
      format.json { render :show, status: status }
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
